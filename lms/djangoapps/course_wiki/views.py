import logging
import re
import cgi

from django.conf import settings
from django.contrib.sites.models import Site
from django.core.exceptions import ImproperlyConfigured
from django.shortcuts import redirect
from wiki.core.exceptions import NoRootURL
from wiki.models import URLPath, Article

from courseware.courses import get_course_by_id
from course_wiki.utils import course_wiki_slug
from django.utils.translation import ugettext as _u

log = logging.getLogger(__name__)


def root_create(request):
    """
    In the edX wiki, we don't show the root_create view. Instead, we
    just create the root automatically if it doesn't exist.
    """
    root = get_or_create_root()
    return redirect('wiki:get', path=root.path)


def course_wiki_redirect(request, course_id):
    """
    This redirects to whatever page on the wiki that the course designates
    as it's home page. A course's wiki must be an article on the root (for
    example, "/6.002x") to keep things simple.
    """
    course = get_course_by_id(course_id)
    course_slug = course_wiki_slug(course)
    valid_slug = True
    if not course_slug:
        log.exception("This course is improperly configured. The slug cannot be empty.")
        valid_slug = False
    if re.match(r'^[-\w\.]+$', course_slug) is None:
        log.exception("This course is improperly configured. The slug can only contain letters, numbers, periods or hyphens.")
        valid_slug = False

    if not valid_slug:
        return redirect("wiki:get", path="")


    # The wiki needs a Site object created. We make sure it exists here
    try:
        site = Site.objects.get_current()
    except Site.DoesNotExist:
        new_site = Site()
        new_site.domain = settings.SITE_NAME
        new_site.name = "edX"
        new_site.save()
        if str(new_site.id) != str(settings.SITE_ID):
            raise ImproperlyConfigured("No site object was created and the SITE_ID doesn't match the newly created one. " + str(new_site.id) + "!=" + str(settings.SITE_ID))

    try:
        urlpath = URLPath.get_by_path(course_slug, select_related=True)

        results = list(Article.objects.filter(id=urlpath.article.id))
        if results:
            article = results[0]
        else:
            article = None

    except (NoRootURL, URLPath.DoesNotExist):
        # We will create it in the next block
        urlpath = None
        article = None

    if not article:
        # create it
        root = get_or_create_root()

        if urlpath:
            # Somehow we got a urlpath without an article. Just delete it and
            # recerate it.
            urlpath.delete()

        urlpath = URLPath.create_article(
            root,
            course_slug,
            title=course_slug,
            content=cgi.escape(_u("This is the wiki for **{0}**'s _{1}_.").format(course.display_org_with_default, course.display_name_with_default)),
            user_message=_u("Course page automatically created."),
            user=None,
            ip_address=None,
            article_kwargs={'owner': None,
                            'group': None,
                            'group_read': True,
                            'group_write': True,
                            'other_read': True,
                            'other_write': True,
                            })

    return redirect("wiki:get", path=urlpath.path)


def get_or_create_root():
    """
    Returns the root article, or creates it if it doesn't exist.
    """
    try:
        root = URLPath.root()
        if not root.article:
            root.delete()
            raise NoRootURL
        return root
    except NoRootURL:
        pass

    starting_content = "\n".join((
    "Welcome to the edX Wiki",
    "===",
    "Visit a course wiki to add an article."))

    root = URLPath.create_root(title="Wiki",
                        content=starting_content)
    article = root.article
    article.group = None
    article.group_read = True
    article.group_write = False
    article.other_read = True
    article.other_write = False
    article.save()

    return root
