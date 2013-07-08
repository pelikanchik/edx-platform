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
    unlock_term = String(
        display_name="Unlock Term",
        help="Term to unlock section",
        scope=Scope.settings,
        default='{"disjunctions": [{"conjunctions": [{"source_section_id": "", "field": "score_rel", "sign": ">", "value":""}]}]}'
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
                'content': child.get_html()
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
    def unlock_term_with_default(self):
        '''
        Return a unlock_term
        '''
        score = self.unlock_term
        if score is None:
           score = 0
        return score


class VerticalDescriptor(VerticalFields, SequenceDescriptor):
    module_class = VerticalModule

    js = {'coffee': [resource_string(__name__, 'js/src/vertical/edit.coffee')]}
    js_module_name = "VerticalDescriptor"

    @property
    def unlock_term_with_default(self):
        '''
        Return a unlock_term
        '''
        score = self.unlock_term
        if score is None:
           score = 0
        return score

    # TODO (victor): Does this need its own definition_to_xml method?  Otherwise it looks
    # like verticals will get exported as sequentials...
