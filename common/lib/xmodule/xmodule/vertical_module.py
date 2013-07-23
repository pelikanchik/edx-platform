# -*- coding: utf-8 -*-
from xmodule.x_module import XModule
from xmodule.seq_module import SequenceDescriptor
from xmodule.progress import Progress
from pkg_resources import resource_string
from xblock.core import Integer, Scope, String

# HACK: This shouldn't be hard-coded to two types
# OBSOLETE: This obsoletes 'type'
class_priority = ['video', 'problem']


class VerticalFields(object):
    has_children = True
    direct_term = String(
        display_name="Условие для перенаправления",
        help="Условие для перенаправления в другой юнит",
        scope=Scope.settings,
        default='empty'
    )

class VerticalModule(VerticalFields, XModule):
    ''' Layout module for laying out submodules vertically.'''

    def __init__(self, *args, **kwargs):
        XModule.__init__(self, *args, **kwargs)
        self.contents = None

    def get_html(self):
        if self.contents is None:
            self.contents = [{
                'id': child.id,
                'content': child.get_html(),
                'direct_term': self.direct_term,
                'progress_detail': Progress.to_js_detail_str(self.get_progress())
            } for child in self.get_display_items()]

        return self.system.render_template('vert_module.html', {
            'items': self.contents
        })

    def get_progress(self):
        # TODO: Cache progress or children array?
        children = self.get_children()
        progresses = [child.get_progress() for child in children]
        progress = reduce(Progress.add_counts, progresses, None)
        return progress

    def get_icon_class(self):
        child_classes = set(child.get_icon_class() for child in self.get_children())
        new_class = 'other'
        for c in class_priority:
            if c in child_classes:
                new_class = c
        return new_class
    @property
    def direct_term_with_default(self):
        '''
        Return a direct_term
        '''
        score = self.direct_term
        if score is None:
           score = 0
        return score


class VerticalDescriptor(VerticalFields, SequenceDescriptor):
    module_class = VerticalModule

    js = {'coffee': [resource_string(__name__, 'js/src/vertical/edit.coffee')]}
    js_module_name = "VerticalDescriptor"

    @property
    def direct_term_with_default(self):
        '''
        Return a direct_term
        '''
        score = self.direct_term
        if score is None:
           score = 0
        return score

    # TODO (victor): Does this need its own definition_to_xml method?  Otherwise it looks
    # like verticals will get exported as sequentials...
