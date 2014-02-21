# -*- coding: utf-8 -*-
from xblock.fragment import Fragment
import random
from random import sample
from xmodule.x_module import XModule
from xmodule.seq_module import SequenceDescriptor
from xmodule.progress import Progress
from pkg_resources import resource_string
from xblock.fields import Integer, Scope, String


# HACK: This shouldn't be hard-coded to two types
# OBSOLETE: This obsoletes 'type'
class_priority = ['video', 'problem']


class VerticalFields(object):
    has_children = True
    direct_term = String(
        display_name="Direct Term",
        help="Term for jumping into another unit",
        scope=Scope.settings,
        default='[]'
    )
    random_problem_count = Integer(
        display_name="Count of problems to show",
        help="Students will see k random problems from n. Value -1 for showing all problems",
        scope=Scope.settings,
        default=-1
    )


class VerticalModule(VerticalFields, XModule):
    ''' Layout module for laying out submodules vertically.'''

    def student_view(self, context):
        fragment = Fragment()
        contents = []
        all_contents = []

        for child in self.get_display_items():
            rendered_child = child.render('student_view', context)
            fragment.add_frag_resources(rendered_child)

            show_now = 'true'

            try:
                problem_now = child.problem_now
                if not problem_now:
                    show_now = 'false'
            except AttributeError:
                pass

            all_contents.append({
                'id': child.id,
                'content': rendered_child.content,
                'father': self.id,                
                'direct_term': self.direct_term,
                'progress_detail': Progress.to_js_detail_str(self.get_progress()),
                'type': child.get_icon_class(),
                'show_now': show_now,
                'problem_time': child.problem_time if child.get_icon_class() == 'problem' else
                [{"id": child2.id if child2.get_icon_class() == 'problem' else "video",
                  "time": child2.problem_time if child2.get_icon_class() == 'problem' and child2.problem_time is not None else "video",
                  } for child2 in self.get_display_items()]
            })
            if self.random_problem_count == -1:
                contents = all_contents
            else:
                contents = random.sample(all_contents, self.random_problem_count)

        fragment.add_content(self.system.render_template('vert_module.html', {
            'items': contents
        }))
        return fragment

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

    def random_show(self):
        count = self.random_problem_count
        if count is None:
            count = -1
        return count


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

    @property
    def random_show(self):
        count = self.random_problem_count
        if count is None:
            count = -1
        return count

    # TODO (victor): Does this need its own definition_to_xml method?  Otherwise it looks
    # like verticals will get exported as sequentials...
