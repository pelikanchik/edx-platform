import json
from django.test.utils import override_settings
from django.test.client import Client, RequestFactory
from xmodule.modulestore.tests.factories import CourseFactory
from student.tests.factories import UserFactory, CourseEnrollmentFactory
from xmodule.modulestore.tests.django_utils import ModuleStoreTestCase
from django.core.urlresolvers import reverse
from util.testing import UrlResetMixin
from django_comment_client.tests.unicode import UnicodeTestMixin
from django_comment_client.forum import views

from courseware.tests.modulestore_config import TEST_DATA_MIXED_MODULESTORE
from nose.tools import assert_true  # pylint: disable=E0611
from mock import patch, Mock

import logging

log = logging.getLogger(__name__)


@override_settings(MODULESTORE=TEST_DATA_MIXED_MODULESTORE)
class ViewsExceptionTestCase(UrlResetMixin, ModuleStoreTestCase):

    @patch.dict("django.conf.settings.FEATURES", {"ENABLE_DISCUSSION_SERVICE": True})
    def setUp(self):

        # Patching the ENABLE_DISCUSSION_SERVICE value affects the contents of urls.py,
        # so we need to call super.setUp() which reloads urls.py (because
        # of the UrlResetMixin)
        super(ViewsExceptionTestCase, self).setUp()

        # create a course
        self.course = CourseFactory.create(org='MITx', course='999',
                                           display_name='Robot Super Course')

        # Patch the comment client user save method so it does not try
        # to create a new cc user when creating a django user
        with patch('student.models.cc.User.save'):
            uname = 'student'
            email = 'student@edx.org'
            password = 'test'

            # Create the student
            self.student = UserFactory(username=uname, password=password, email=email)

            # Enroll the student in the course
            CourseEnrollmentFactory(user=self.student, course_id=self.course.id)

            # Log the student in
            self.client = Client()
            assert_true(self.client.login(username=uname, password=password))

    @patch('student.models.cc.User.from_django_user')
    @patch('student.models.cc.User.active_threads')
    def test_user_profile_exception(self, mock_threads, mock_from_django_user):

        # Mock the code that makes the HTTP requests to the cs_comment_service app
        # for the profiled user's active threads
        mock_threads.return_value = [], 1, 1

        # Mock the code that makes the HTTP request to the cs_comment_service app
        # that gets the current user's info
        mock_from_django_user.return_value = Mock()

        url = reverse('django_comment_client.forum.views.user_profile',
                      kwargs={'course_id': self.course.id, 'user_id': '12345'})  # There is no user 12345
        self.response = self.client.get(url)
        self.assertEqual(self.response.status_code, 404)

    @patch('student.models.cc.User.from_django_user')
    @patch('student.models.cc.User.subscribed_threads')
    def test_user_followed_threads_exception(self, mock_threads, mock_from_django_user):

        # Mock the code that makes the HTTP requests to the cs_comment_service app
        # for the profiled user's active threads
        mock_threads.return_value = [], 1, 1

        # Mock the code that makes the HTTP request to the cs_comment_service app
        # that gets the current user's info
        mock_from_django_user.return_value = Mock()

        url = reverse('django_comment_client.forum.views.followed_threads',
                      kwargs={'course_id': self.course.id, 'user_id': '12345'})  # There is no user 12345
        self.response = self.client.get(url)
        self.assertEqual(self.response.status_code, 404)


def make_mock_request_impl(text, thread_id=None):
    def mock_request_impl(*args, **kwargs):
        url = args[1]
        if url.endswith("threads"):
            return Mock(
                status_code=200,
                text=json.dumps({
                    "collection": [{
                        "id": "dummy_thread_id",
                        "type": "thread",
                        "commentable_id": "dummy_commentable_id",
                        "title": text,
                        "body": text,
                    }]
                })
            )
        elif thread_id and url.endswith(thread_id):
            return Mock(
                status_code=200,
                text=json.dumps({
                    "id": thread_id,
                    "type": "thread",
                    "title": text,
                    "body": text,
                    "commentable_id": "dummy_commentable_id",
                    "children": [{
                        "id": "dummy_comment_id",
                        "type": "comment",
                        "body": text,
                    }],
                })
            )
        else: # user query
            return Mock(
                status_code=200,
                text=json.dumps({
                    "upvoted_ids": [],
                    "downvoted_ids": [],
                    "subscribed_thread_ids": [],
                })
            )
    return mock_request_impl


@override_settings(MODULESTORE=TEST_DATA_MIXED_MODULESTORE)
class InlineDiscussionUnicodeTestCase(ModuleStoreTestCase, UnicodeTestMixin):
    def setUp(self):
        self.course = CourseFactory.create()
        self.student = UserFactory.create()
        CourseEnrollmentFactory(user=self.student, course_id=self.course.id)

    @patch('lms.lib.comment_client.utils.requests.request')
    def _test_unicode_data(self, text, mock_request):
        mock_request.side_effect = make_mock_request_impl(text)
        request = RequestFactory().get("dummy_url")
        request.user = self.student

        response = views.inline_discussion(request, self.course.id, "dummy_discussion_id")
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(response_data["discussion_data"][0]["title"], text)
        self.assertEqual(response_data["discussion_data"][0]["body"], text)


@override_settings(MODULESTORE=TEST_DATA_MIXED_MODULESTORE)
class ForumFormDiscussionUnicodeTestCase(ModuleStoreTestCase, UnicodeTestMixin):
    def setUp(self):
        self.course = CourseFactory.create()
        self.student = UserFactory.create()
        CourseEnrollmentFactory(user=self.student, course_id=self.course.id)

    @patch('lms.lib.comment_client.utils.requests.request')
    def _test_unicode_data(self, text, mock_request):
        mock_request.side_effect = make_mock_request_impl(text)
        request = RequestFactory().get("dummy_url")
        request.user = self.student
        request.META["HTTP_X_REQUESTED_WITH"] = "XMLHttpRequest" # so request.is_ajax() == True

        response = views.forum_form_discussion(request, self.course.id)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(response_data["discussion_data"][0]["title"], text)
        self.assertEqual(response_data["discussion_data"][0]["body"], text)


@override_settings(MODULESTORE=TEST_DATA_MIXED_MODULESTORE)
class SingleThreadUnicodeTestCase(ModuleStoreTestCase, UnicodeTestMixin):
    def setUp(self):
        self.course = CourseFactory.create()
        self.student = UserFactory.create()
        CourseEnrollmentFactory(user=self.student, course_id=self.course.id)

    @patch('lms.lib.comment_client.utils.requests.request')
    def _test_unicode_data(self, text, mock_request):
        thread_id = "test_thread_id"
        mock_request.side_effect = make_mock_request_impl(text, thread_id)
        request = RequestFactory().get("dummy_url")
        request.user = self.student
        request.META["HTTP_X_REQUESTED_WITH"] = "XMLHttpRequest" # so request.is_ajax() == True

        response = views.single_thread(request, self.course.id, "dummy_discussion_id", thread_id)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(response_data["content"]["title"], text)
        self.assertEqual(response_data["content"]["body"], text)


@override_settings(MODULESTORE=TEST_DATA_MIXED_MODULESTORE)
class UserProfileUnicodeTestCase(ModuleStoreTestCase, UnicodeTestMixin):
    def setUp(self):
        self.course = CourseFactory.create()
        self.student = UserFactory.create()
        CourseEnrollmentFactory(user=self.student, course_id=self.course.id)

    @patch('lms.lib.comment_client.utils.requests.request')
    def _test_unicode_data(self, text, mock_request):
        mock_request.side_effect = make_mock_request_impl(text)
        request = RequestFactory().get("dummy_url")
        request.user = self.student
        request.META["HTTP_X_REQUESTED_WITH"] = "XMLHttpRequest" # so request.is_ajax() == True

        response = views.user_profile(request, self.course.id, str(self.student.id))
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(response_data["discussion_data"][0]["title"], text)
        self.assertEqual(response_data["discussion_data"][0]["body"], text)


@override_settings(MODULESTORE=TEST_DATA_MIXED_MODULESTORE)
class FollowedThreadsUnicodeTestCase(ModuleStoreTestCase, UnicodeTestMixin):
    def setUp(self):
        self.course = CourseFactory.create()
        self.student = UserFactory.create()
        CourseEnrollmentFactory(user=self.student, course_id=self.course.id)

    @patch('lms.lib.comment_client.utils.requests.request')
    def _test_unicode_data(self, text, mock_request):
        mock_request.side_effect = make_mock_request_impl(text)
        request = RequestFactory().get("dummy_url")
        request.user = self.student
        request.META["HTTP_X_REQUESTED_WITH"] = "XMLHttpRequest" # so request.is_ajax() == True

        response = views.followed_threads(request, self.course.id, str(self.student.id))
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(response_data["discussion_data"][0]["title"], text)
        self.assertEqual(response_data["discussion_data"][0]["body"], text)
