# -*- coding: utf-8 -*-
import json
import logging

from lxml import etree

from xblock.fields import Integer, Scope, String
from xblock.fragment import Fragment
from pkg_resources import resource_string

from .exceptions import NotFoundError
from .fields import Date
from .mako_module import MakoModuleDescriptor
from .progress import Progress
from .x_module import XModule
from .xml_module import XmlDescriptor
import time

log = logging.getLogger(__name__)
# HACK: This shouldn't be hard-coded to two types
# OBSOLETE: This obsoletes 'type'
class_priority = ['video', 'problem']


class SequenceFields(object):
    has_children = True
    unlock_term = String(
        display_name="Unlock Term",
        help="Term to unlock section",
        scope=Scope.settings,
        default='{"disjunctions": []}'
    )

    available_for_demo = Integer(
        display_name="Available For Demo",
        help="Is section available for demo?",
        scope=Scope.settings,
        default=0
    )
    # NOTE: Position is 1-indexed.  This is silly, but there are now student
    # positions saved on prod, so it's not easy to fix.
    position = Integer(help="Last tab viewed in this sequence", scope=Scope.user_state)
    due = Date(help="Date that this problem is due by", scope=Scope.settings)
    extended_due = Date(
        help="Date that this problem is due by for a particular student. This "
             "can be set by an instructor, and will override the global due "
             "date if it is set to a date that is later than the global due "
             "date.",
        default=None,
        scope=Scope.user_state,
    )

def get_unit(unit_id, section):
        for child in section.get_children():
            if unit_id in child.id:
                return child
        return None


# Проверка формата direct_term: если direct_term старого формата - преобразовать в новый
# Если формат не соответствует старому или новому - вернуть пустой список
# alexger, 16.04.2014

def check_term(term):
    for element_term in term:

        try:
            element_term["direct_unit"]
        except:
            try:
                element_term["direct_unit"] = element_term.pop("direct_element_id")
            except Exception:
                log.exception(u"ERROR: {0}".format(Exception))
                return []


        if element_term["disjunctions"]:

            for disjunction in element_term["disjunctions"]:

                if disjunction["conjunctions"]:

                    for conjunction in disjunction["conjunctions"]:

                        try:
                            conjunction["source_unit"]
                        except:
                            try:
                                conjunction["source_unit"] = conjunction.pop("source_element_id")
                            except Exception:
                                log.exception(u"ERROR: {0}".format(Exception))
                                return []

                        try:
                            conjunction["splitter"]
                        except:
                            try:
                                conjunction["splitter"] = conjunction.pop("field")
                            except Exception:
                                log.exception(u"ERROR: {0}".format(Exception))
                                return []
                        try:
                            conjunction["option"]
                        except:
                            try:
                                conjunction["option"] = conjunction.pop("sign")
                            except Exception:
                                log.exception(u"ERROR: {0}".format(Exception))
                                return []

    return term

def elementary_conjunction(term, section):
        error_return = True
        if len(term["source_unit"]) == 0:
            return error_return
        if len(term["splitter"]) == 0:
            return error_return
        if len(term["option"]) == 0:
            return error_return
        if len(term["value"]) == 0:
            return error_return

        unit = get_unit(term["source_unit"], section)

        if not unit:
            return error_return


        if term["splitter"] == "score_abs" or term["splitter"] == "score_rel":
        # Если перенаправление зависит от результата:

            value = 0
            term["value"] = int(term["value"])

            if unit.get_progress():

                progress = unit.get_progress()

                if term["splitter"]=="score_rel":
                    value = Progress.percent(progress)


                if term["splitter"]=="score_abs":
                    str_value = Progress.frac(progress)
                    value = str_value[0]

            else:
                value = 0

            if term["option"]== "more":
                if value > term["value"]:
                    return True
                else:
                    return False
            if term["option"]== "more-equals":
                if value >= term["value"]:
                    return True
                else:
                    return False

            if term["option"]== "less":
                if value < term["value"]:
                    return True
                else:
                    return False

            if term["option"]== "less-equals":
                if value <= term["value"]:
                    return True
                else:
                    return False
            if term["option"]== "equals":
                if value == term["value"]:
                    return True
                else:
                    return False
        else:
        # Если перенаправление зависит от задания с вариантами ответов:
            for problem in unit._xmodule.get_children():
                for key in problem.student_answers:
                    formatted_answer = key + "_" + problem.student_answers[key]
                    if formatted_answer == term["option"]:
                        return True
            return False

        return error_return


class SequenceModule(SequenceFields, XModule):
    '''
    Layout module which lays out content in a temporal sequence
    '''
    js = {'coffee': [resource_string(__name__,
                                     'js/src/sequence/display.coffee')],
          'js': [resource_string(__name__, 'js/src/sequence/display/jquery.sequence.js')]}
    css = {'scss': [resource_string(__name__, 'css/sequence/display.scss')]}
    js_module_name = "Sequence"


    def __init__(self, *args, **kwargs):
        super(SequenceModule, self).__init__(*args, **kwargs)

        # if position is specified in system, then use that instead
        if getattr(self.system, 'position', None) is not None:
            self.position = int(self.system.position)

    def get_progress(self):
        '''
        Return the total progress, adding total done and total available.
        (assumes that each submodule uses the same "units" for progress.)
        '''
        # TODO: Cache progress or children array?
        children = self.get_children()
        progresses = [child.get_progress() for child in children]
        progress = reduce(Progress.add_counts, progresses, None)
        return progress

    def handle_ajax(self, dispatch, data):  # TODO: bounds checking
        '''
        get = request.POST instance
        '''
        if dispatch == 'dynamo':
            print "start"
            print time.time()
            section = self
            cur_position = self.position
            pos = 1
            print cur_position
            for child in self.get_children():
                if pos == cur_position:
                    term = json.loads(child.direct_term_with_default)
                    print term

                    term = check_term(term)

                    for element_term in term:
                        if not element_term["disjunctions"]:
                            print "end"
                            print time.time()
                            return json.dumps({'position': cur_position})
                        for disjunction in element_term["disjunctions"]:
                            term_result = element_term["direct_unit"]
                            if not disjunction["conjunctions"]:
                                new_position = 1
                                for check_child in self.get_children():
                                    if term_result in check_child.id:
                                        self.position = new_position
                                        print "end"
                                        print time.time()
                                        return json.dumps({'position': new_position})
                                    new_position += 1
                            conjunctions_result = True
                            for conjunction in disjunction["conjunctions"]:
                                conjunctions_result *= elementary_conjunction(conjunction, section)
                            if conjunctions_result == 1:
                                new_position = 1
                                for check_child in self.get_children():
                                    if term_result in check_child.id:
                                        self.position = new_position
                                        print "end"
                                        print time.time()
                                        return json.dumps({'position': new_position})
                                    new_position += 1
                pos += 1
            print "end"
            print time.time()
            return json.dumps({'position': cur_position})
        if dispatch == 'goto_position':
            print int(data['position'])
            self.position = int(data['position'])
            print self.position
            return json.dumps({'success': True})
        raise NotFoundError('Unexpected dispatch type')

    def student_view(self, context):
        # If we're rendering this sequence, but no position is set yet,
        # default the position to the first element
        if self.position is None:
            self.position = 1

        ## Returns a set of all types of all sub-children
        contents = []

        fragment = Fragment()

        for child in self.get_display_items():
            progress = child.get_progress()
            rendered_child = child.render('student_view', context)
            fragment.add_frag_resources(rendered_child)

            childinfo = {
                'content': rendered_child.content,
                'title': "\n".join(
                    grand_child.display_name
                    for grand_child in child.get_children()
                    if grand_child.display_name is not None
                ),
                'progress_status': Progress.to_js_status_str(progress),
                'progress_detail': Progress.to_js_detail_str(progress),
                'type': child.get_icon_class(),
                'id': child.id,
                'direct_term': child.direct_term_with_default
            }
            if childinfo['title'] == '':
                childinfo['title'] = child.display_name_with_default
            contents.append(childinfo)

        params = {'items': contents,
                  'element_id': self.location.html_id(),
                  'course_id': self.course_id,
                  'item_id': self.id,
                  'position': self.position,
                  'tag': self.location.category,
                  'ajax_url': self.system.ajax_url,
                  'staff_access': context['staff_access'],
                  }

        fragment.add_content(self.system.render_template('seq_module.html', params))

        return fragment

    def get_icon_class(self):
        child_classes = set(child.get_icon_class()
                            for child in self.get_children())
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
        unlock_term = self.unlock_term
        if unlock_term is None:
           unlock_term = 0
        return unlock_term

    @property
    def available_for_demo_with_default(self):
        '''
        Returns available_for_demo
        '''
        available_for_demo = self.available_for_demo
        if available_for_demo is None:
           available_for_demo = 0
        return available_for_demo


class SequenceDescriptor(SequenceFields, MakoModuleDescriptor, XmlDescriptor):
    mako_template = 'widgets/sequence-edit.html'
    module_class = SequenceModule

    js = {'coffee': [resource_string(__name__, 'js/src/sequence/edit.coffee')]}
    js_module_name = "SequenceDescriptor"

    @classmethod
    def definition_from_xml(cls, xml_object, system):
        children = []
        for child in xml_object:
            try:
                child_block = system.process_xml(etree.tostring(child, encoding='unicode'))
                children.append(child_block.scope_ids.usage_id)
            except Exception as e:
                log.exception("Unable to load child when parsing Sequence. Continuing...")
                if system.error_tracker is not None:
                    system.error_tracker(u"ERROR: {0}".format(e))
                continue
        return {}, children

    def definition_to_xml(self, resource_fs):
        xml_object = etree.Element('sequential')
        for child in self.get_children():
            xml_object.append(
                etree.fromstring(child.export_to_xml(resource_fs)))
        return xml_object

    @property
    def unlock_term_with_default(self):
        '''
        Return a unlock_term
        '''
        unlock_term = self.unlock_term
        if unlock_term is None:
           unlock_term = 0
        return unlock_term

    @property
    def available_for_demo_with_default(self):
        '''
        Return a available_for_demo
        '''
        available_for_demo = self.available_for_demo
        if available_for_demo is None:
           available_for_demo = 0
        return available_for_demo
