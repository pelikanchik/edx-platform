"""
Module implementing `xblock.runtime.Runtime` functionality for the LMS
"""

import re

from django.core.urlresolvers import reverse

from xmodule.x_module import ModuleSystem


def _quote_slashes(match):
    """
    Helper function for `quote_slashes`
    """
    matched = match.group(0)
    # We have to escape ';', because that is our
    # escape sequence identifier (otherwise, the escaping)
    # couldn't distinguish between us adding ';_' to the string
    # and ';_' appearing naturally in the string
    if matched == ';':
        return ';;'
    elif matched == '/':
        return ';_'
    else:
        return matched


def quote_slashes(text):
    """
    Quote '/' characters so that they aren't visible to
    django's url quoting, unquoting, or url regex matching.

    Escapes '/'' to the sequence ';_', and ';' to the sequence
    ';;'. By making the escape sequence fixed length, and escaping
    identifier character ';', we are able to reverse the escaping.
    """
    return re.sub(r'[;/]', _quote_slashes, text)


def _unquote_slashes(match):
    """
    Helper function for `unquote_slashes`
    """
    matched = match.group(0)
    if matched == ';;':
        return ';'
    elif matched == ';_':
        return '/'
    else:
        return matched


def unquote_slashes(text):
    """
    Unquote slashes quoted by `quote_slashes`
    """
    return re.sub(r'(;;|;_)', _unquote_slashes, text)


def handler_url(course_id, block, handler, suffix='', query=''):
    """
    Return an xblock handler url for the specified course, block and handler
    """
    return reverse('xblock_handler', kwargs={
        'course_id': course_id,
        'usage_id': quote_slashes(str(block.scope_ids.usage_id)),
        'handler': handler,
        'suffix': suffix,
    }) + '?' + query


def handler_prefix(course_id, block):
    """
    Returns a prefix for use by the javascript handler_url function.
    The prefix is a valid handler url the handler name is appended to it.
    """
    return handler_url(course_id, block, '').rstrip('/')


class LmsHandlerUrls(object):
    """
    A runtime mixin that provides a handler_url function that routes
    to the LMS' xblock handler view.

    This must be mixed in to a runtime that already accepts and stores
    a course_id
    """

    def handler_url(self, block, handler_name, suffix='', query=''):  # pylint: disable=unused-argument
        """See :method:`xblock.runtime:Runtime.handler_url`"""
        return handler_url(self.course_id, block, handler_name, suffix='', query='')  # pylint: disable=no-member


class LmsModuleSystem(LmsHandlerUrls, ModuleSystem):  # pylint: disable=abstract-method
    """
    ModuleSystem specialized to the LMS
    """
    pass
