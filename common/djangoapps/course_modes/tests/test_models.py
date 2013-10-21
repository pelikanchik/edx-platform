"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from datetime import datetime, timedelta
import pytz

from django.test import TestCase
from course_modes.models import CourseMode, Mode


class CourseModeModelTest(TestCase):
    """
    Tests for the CourseMode model
    """

    def setUp(self):
        self.course_id = 'TestCourse'
        CourseMode.objects.all().delete()

    def create_mode(self, mode_slug, mode_name, min_price=0, suggested_prices='', currency='usd'):
        """
        Create a new course mode
        """
        return CourseMode.objects.get_or_create(
            course_id=self.course_id,
            mode_display_name=mode_name,
            mode_slug=mode_slug,
            min_price=min_price,
            suggested_prices=suggested_prices,
            currency=currency
        )

    def test_modes_for_course_empty(self):
        """
        If we can't find any modes, we should get back the default mode
        """
        # shouldn't be able to find a corresponding course
        modes = CourseMode.modes_for_course(self.course_id)
        self.assertEqual([CourseMode.DEFAULT_MODE], modes)

    def test_nodes_for_course_single(self):
        """
        Find the modes for a course with only one mode
        """

        self.create_mode('verified', 'Verified Certificate')
        modes = CourseMode.modes_for_course(self.course_id)
        mode = Mode(u'verified', u'Verified Certificate', 0, '', 'usd')
        self.assertEqual([mode], modes)

        modes_dict = CourseMode.modes_for_course_dict(self.course_id)
        self.assertEqual(modes_dict['verified'], mode)
        self.assertEqual(CourseMode.mode_for_course(self.course_id, 'verified'),
                         mode)

    def test_modes_for_course_multiple(self):
        """
        Finding the modes when there's multiple modes
        """
        mode1 = Mode(u'honor', u'Honor Code Certificate', 0, '', 'usd')
        mode2 = Mode(u'verified', u'Verified Certificate', 0, '', 'usd')
        set_modes = [mode1, mode2]
        for mode in set_modes:
            self.create_mode(mode.slug, mode.name, mode.min_price, mode.suggested_prices)

        modes = CourseMode.modes_for_course(self.course_id)
        self.assertEqual(modes, set_modes)
        self.assertEqual(mode1, CourseMode.mode_for_course(self.course_id, u'honor'))
        self.assertEqual(mode2, CourseMode.mode_for_course(self.course_id, u'verified'))
        self.assertIsNone(CourseMode.mode_for_course(self.course_id, 'DNE'))

    def test_modes_for_course_expired(self):
        expired_mode, _status = self.create_mode('verified', 'Verified Certificate')
        expired_mode.expiration_date = datetime.now(pytz.UTC) + timedelta(days=-1)
        expired_mode.save()
        modes = CourseMode.modes_for_course(self.course_id)
        self.assertEqual([CourseMode.DEFAULT_MODE], modes)

        mode1 = Mode(u'honor', u'Honor Code Certificate', 0, '', 'usd')
        self.create_mode(mode1.slug, mode1.name, mode1.min_price, mode1.suggested_prices)
        modes = CourseMode.modes_for_course(self.course_id)
        self.assertEqual([mode1], modes)