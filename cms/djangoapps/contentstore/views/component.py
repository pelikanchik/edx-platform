# -*- coding: utf-8 -*-
import json
import logging
from collections import defaultdict

from django.http import HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.core.exceptions import PermissionDenied
from django_future.csrf import ensure_csrf_cookie
from django.conf import settings
from xmodule.modulestore.exceptions import ItemNotFoundError
from edxmako.shortcuts import render_to_response

from xmodule.modulestore.django import modulestore
from xmodule.util.date_utils import get_default_time_display
from xmodule.modulestore.django import loc_mapper
from xmodule.modulestore.locator import BlockUsageLocator
from xmodule.seq_module import check_term

from xblock.fields import Scope
from util.json_request import expect_json, JsonResponse

from contentstore.utils import get_lms_link_for_item, compute_unit_state, UnitState, get_course_for_item

from models.settings.course_grading import CourseGradingModel

from .access import has_access
from xmodule.x_module import XModuleDescriptor
from xblock.plugin import PluginMissingError
from xblock.runtime import Mixologist
from courseware.model_data import FieldDataCache
from preview import _load_preview_module

__all__ = ['OPEN_ENDED_COMPONENT_TYPES',
           'ADVANCED_COMPONENT_POLICY_KEY',
           'show_graph',
           'subsection_handler',
           'unit_handler'
           ]

log = logging.getLogger(__name__)

# NOTE: unit_handler assumes this list is disjoint from ADVANCED_COMPONENT_TYPES
COMPONENT_TYPES = ['discussion', 'html', 'problem', 'video']

OPEN_ENDED_COMPONENT_TYPES = ["combinedopenended", "peergrading"]
NOTE_COMPONENT_TYPES = ['notes']
ADVANCED_COMPONENT_TYPES = [
    'annotatable',
    'word_cloud',
    'graphical_slider_tool',
    'lti',
] + OPEN_ENDED_COMPONENT_TYPES + NOTE_COMPONENT_TYPES
ADVANCED_COMPONENT_CATEGORY = 'advanced'
ADVANCED_COMPONENT_POLICY_KEY = 'advanced_modules'


def clean_term_of_dependencies(input_term, url_name):
    output_term = []
    input_term = check_term(json.loads(str(input_term)))
    for element_term in input_term:
        if element_term["direct_unit"] != url_name:

            output_element_term = {"direct_unit": element_term["direct_unit"], "disjunctions":[] }

            for disjunction in element_term["disjunctions"]:

                output_disjunction = {"conjunctions":[]}
                for conjunction in disjunction["conjunctions"]:
                    if conjunction["source_unit"] != url_name:
                        output_disjunction["conjunctions"].append(conjunction)

                if (output_disjunction["conjunctions"]):
                    output_element_term["disjunctions"].append(output_disjunction)
            if (output_element_term["disjunctions"]):
                output_term.append(output_element_term)

    return json.dumps(output_term)

def get_dependent_units(unit_id, units, course_id):

    as_direct_unit = []
    as_source_unit = []
    as_direct_unit_filtered = []
    as_source_unit_filtered = []

    for unit in units:
        term = check_term(json.loads(str(unit.direct_term_with_default)))
        for element_term in term:

            if element_term["direct_unit"] == unit_id and unit.url_name != unit_id:
                as_direct_unit.append({"name": unit.display_name, "url": loc_mapper().translate_location(course_id, unit.location, False, True).url_reverse('unit')})

            for disjunction in element_term["disjunctions"]:
                for conjunction in disjunction["conjunctions"]:
                    if conjunction["source_unit"] == unit_id and unit.url_name != unit_id:
                       as_source_unit.append({"name": unit.display_name, "url": loc_mapper().translate_location(course_id, unit.location, False, True).url_reverse('unit')})

    for element in as_direct_unit:
        if element not in as_direct_unit_filtered:
            as_direct_unit_filtered.append(element)

    for element in as_source_unit:
      if element not in as_source_unit_filtered:
        as_source_unit_filtered.append(element)

    return {"as_direct_unit": as_direct_unit_filtered, "as_source_unit":as_source_unit_filtered}

# checking if section with id = section_id doesn't exist in sections
def is_section_exist(section_id, sections):
    for section in sections:
       for subsection in section.get_children():
           if subsection.url_name == section_id:
                return True

    return False


#@require_http_methods(("GET", "POST", "PUT"))
#@ensure_csrf_cookie
@login_required
def show_graph(request, tag=None, package_id=None, branch=None, version_guid=None, block=None):

    print ("packis")
    print (package_id)
    print (branch)
    print (version_guid)
    print (block)

    locator = BlockUsageLocator(package_id=package_id, branch=branch, version_guid=version_guid, block_id=block)
    try:
        old_location, course, item, lms_link = _get_item_in_course(request, locator)
    except ItemNotFoundError:
        return HttpResponseBadRequest()

    # make sure that location references a 'sequential', otherwise return BadRequest
    if item.location.category != 'sequential':
        return HttpResponseBadRequest()


    names = []
    data = {}
    graph = []
    states_dict = {}

    locators_dict = {}
    for every_unit in item.get_children():

        every_unit_locator = loc_mapper().translate_location(None, every_unit.location)

        # layout position is stored in item.
        # there are two branches where the items are stored: 'draft' and 'published'.
        # The existence of 'draft' version is required.
        # Change in layout position are saved into both branches,
        # but just in case I force it to use the data from 'draft' branch,
        # because I expect various bad things to happen if I don't.
        draft_locator = loc_mapper().translate_location(None, every_unit.location, published=False)
        try:
            old_location, course, draft_unit_item, lms_link = _get_item_in_course(request, draft_locator)
        except ItemNotFoundError:
            return HttpResponseBadRequest()

        current_locator = str(every_unit_locator)

        state = compute_unit_state(every_unit)
        states_dict[current_locator] = state

        names.append({
            "name": every_unit.display_name_with_default,
            "location": str(every_unit.location),
            "location_name": str(every_unit.location.name),
            "locator": current_locator,
            "coords_x": str(every_unit.coords_x),
            "coords_y": str(every_unit.coords_y)
        })

        data[current_locator] = []
        current_old_location = str(every_unit.location)
        i = current_old_location.rfind("/")
        short_name = current_old_location[i+1:]
        locators_dict[every_unit.location.name] = str(every_unit_locator)

        for child in every_unit.get_children():

            data[current_locator].append({
                "url":  child.url_name,
                "name": child.display_name_with_default,
                "type": child.get_class
            })

    for every_unit in item.get_children():
        edge = check_term(json.loads(str(every_unit.direct_term_with_default)))
        for x in edge:
            #print()

            try:
                x["direct_unit"] = locators_dict[x["direct_unit"]]
                for every_edge in x["disjunctions"]:
                    for every_cond in every_edge["conjunctions"]:
                        every_cond["source_unit"] = locators_dict[every_cond["source_unit"]]
            except KeyError:
                # we are dealing with a ghost of removed node
                print(x)
                del x

        graph.append(edge)


    (splitters, options) = get_splitters_and_options(item.get_children(), request)


    return render_to_response('graph.html',
                              {'subsection': item,
                               'locator': locator,
                               'data_string': json.dumps(data),
                               'names_string': json.dumps(names),
                               'graph_string': json.dumps(graph),
                               'splitters': json.dumps(splitters),
                               'options': json.dumps(options),
                               'states': json.dumps(states_dict),
                               'locators_dict': locators_dict})



@require_http_methods(["GET"])
@login_required
def subsection_handler(request, tag=None, package_id=None, branch=None, version_guid=None, block=None):
    """
    The restful handler for subsection-specific requests.

    GET
        html: return html page for editing a subsection
        json: not currently supported
    """
    if 'text/html' in request.META.get('HTTP_ACCEPT', 'text/html'):
        locator = BlockUsageLocator(package_id=package_id, branch=branch, version_guid=version_guid, block_id=block)
        try:
            old_location, course, item, lms_link = _get_item_in_course(request, locator)
        except ItemNotFoundError:
            return HttpResponseBadRequest()

        preview_link = get_lms_link_for_item(old_location, course_id=course.location.course_id, preview=True)

        # make sure that location references a 'sequential', otherwise return
        # BadRequest
        if item.location.category != 'sequential':
            return HttpResponseBadRequest()

        parent_locs = modulestore().get_parent_locations(old_location, None)

        # we're for now assuming a single parent
        if len(parent_locs) != 1:
            logging.error(
                'Multiple (or none) parents have been found for %s',
                unicode(locator)
            )

        # this should blow up if we don't find any parents, which would be erroneous
        parent = modulestore().get_item(parent_locs[0])

        # remove all metadata from the generic dictionary that is presented in a
        # more normalized UI. We only want to display the XBlocks fields, not
        # the fields from any mixins that have been added
        fields = getattr(item, 'unmixed_class', item.__class__).fields

        policy_metadata = dict(
            (field.name, field.read_from(item))
            for field
            in fields.values()
            if field.name not in ['display_name', 'start', 'due', 'format'] and field.scope == Scope.settings
        )

        sections = modulestore().get_item(course.location, depth=3).get_children()

        can_view_live = False
        subsection_units = item.get_children()

        for unit in subsection_units:
            state = compute_unit_state(unit)

            if state == UnitState.public or state == UnitState.draft:
                can_view_live = True

        course_locator = loc_mapper().translate_location(
            course.location.course_id, course.location, False, True
        )

        return render_to_response(
            'edit_subsection.html',
            {
                'subsection': item,
                'context_course': course,
                'new_unit_category': 'vertical',
                'lms_link': lms_link,
                'preview_link': preview_link,
                'course_graders': json.dumps(CourseGradingModel.fetch(course_locator).graders),
                'parent_item': parent,
                'locator': locator,
                'policy_metadata': policy_metadata,
                'subsection_units': subsection_units,
                'sections': sections,
                'can_view_live': can_view_live
            }
        )
    else:
        return HttpResponseBadRequest("Only supports html requests")


def _load_mixed_class(category):
    """
    Load an XBlock by category name, and apply all defined mixins
    """
    component_class = XModuleDescriptor.load_class(category)
    mixologist = Mixologist(settings.XBLOCK_MIXINS)
    return mixologist.mix(component_class)

def get_problem_options(request, component):

    try:
        problem_descriptor = modulestore().get_item(component.location.url(), depth=1)
    except Exception as err:
        log.debug(err)

    print component.location.html_id()
    problem_module = _load_preview_module(request, problem_descriptor)
    problem_html = problem_module.get_context()['data']
    options = []
    inputs = problem_module.lcp.inputs

    for id in inputs:
        input = inputs[id]
        if input.tag == "choicegroup":

            for choice in input.choices:
                option = {
                    "id": input.input_id + "_" + choice[0],
                    "parent_id": component.location.url(),
                    "title": choice[1]
                }
                options.append(option)
    options.sort()
    return options

def get_splitters_and_options(units, request):
    splitters = []
    options = []

    for unit in units:

        for component in unit.get_children():

            if component.category == 'problem':

                options += get_problem_options(request, component)
                splitters.append(
                    {
                        "id" : component.location.url(),
                        "parent_id" : unit.location.name,
                        "title": component.display_name
                    }
                )
    return (splitters, options)

@require_http_methods(["GET"])
@login_required
def unit_handler(request, tag=None, package_id=None, branch=None, version_guid=None, block=None):
    """
    The restful handler for unit-specific requests.

    GET
        html: return html page for editing a unit
        json: not currently supported
    """
    if 'text/html' in request.META.get('HTTP_ACCEPT', 'text/html'):
        locator = BlockUsageLocator(package_id=package_id, branch=branch, version_guid=version_guid, block_id=block)
        try:
            old_location, course, item, lms_link = _get_item_in_course(request, locator)
        except ItemNotFoundError:
            return HttpResponseBadRequest()

        component_templates = defaultdict(list)
        for category in COMPONENT_TYPES:
            component_class = _load_mixed_class(category)
            # add the default template
            # TODO: Once mixins are defined per-application, rather than per-runtime,
            # this should use a cms mixed-in class. (cpennington)
            if hasattr(component_class, 'display_name'):
                display_name = component_class.display_name.default or 'Blank'
            else:
                display_name = 'Blank'
            component_templates[category].append((
                display_name,
                category,
                False,  # No defaults have markdown (hardcoded current default)
                None  # no boilerplate for overrides
            ))
            # add boilerplates
            if hasattr(component_class, 'templates'):
                for template in component_class.templates():
                    filter_templates = getattr(component_class, 'filter_templates', None)
                    if not filter_templates or filter_templates(template, course):
                        component_templates[category].append((
                            template['metadata'].get('display_name'),
                            category,
                            template['metadata'].get('markdown') is not None,
                            template.get('template_id')
                        ))

        # Check if there are any advanced modules specified in the course policy.
        # These modules should be specified as a list of strings, where the strings
        # are the names of the modules in ADVANCED_COMPONENT_TYPES that should be
        # enabled for the course.
        course_advanced_keys = course.advanced_modules

        # Set component types according to course policy file
        if isinstance(course_advanced_keys, list):
            for category in course_advanced_keys:
                if category in ADVANCED_COMPONENT_TYPES:
                    # Do I need to allow for boilerplates or just defaults on the
                    # class? i.e., can an advanced have more than one entry in the
                    # menu? one for default and others for prefilled boilerplates?
                    try:
                        component_class = _load_mixed_class(category)

                        component_templates['advanced'].append(
                            (
                                component_class.display_name.default or category,
                                category,
                                False,
                                None  # don't override default data
                            )
                        )
                    except PluginMissingError:
                        # dhm: I got this once but it can happen any time the
                        # course author configures an advanced component which does
                        # not exist on the server. This code here merely
                        # prevents any authors from trying to instantiate the
                        # non-existent component type by not showing it in the menu
                        pass
        else:
            log.error(
                "Improper format for course advanced keys! %s",
                course_advanced_keys
            )

        components = [
            loc_mapper().translate_location(
                course.location.course_id, component.location, False, True
            )
            for component
            in item.get_children()
        ]

        # TODO (cpennington): If we share units between courses,
        # this will need to change to check permissions correctly so as
        # to pick the correct parent subsection

        containing_subsection_locs = modulestore().get_parent_locations(old_location, None)
        containing_subsection = modulestore().get_item(containing_subsection_locs[0])
        containing_section_locs = modulestore().get_parent_locations(
            containing_subsection.location, None
        )
        containing_section = modulestore().get_item(containing_section_locs[0])

        # cdodge hack. We're having trouble previewing drafts via jump_to redirect
        # so let's generate the link url here

        # need to figure out where this item is in the list of children as the
        # preview will need this
        index = 1
        for child in containing_subsection.get_children():
            if child.location == item.location:
                break
            index = index + 1

        preview_lms_base = settings.FEATURES.get('PREVIEW_LMS_BASE')

        preview_lms_link = (
            '//{preview_lms_base}/courses/{org}/{course}/'
            '{course_name}/courseware/{section}/{subsection}/{index}'
        ).format(
            preview_lms_base=preview_lms_base,
            lms_base=settings.LMS_BASE,
            org=course.location.org,
            course=course.location.course,
            course_name=course.location.name,
            section=containing_section.location.name,
            subsection=containing_subsection.location.name,
            index=index
        )


        units = [unit for unit in containing_subsection.get_children()]

        (splitters, options) = get_splitters_and_options(units, request)


        direct_term = json.loads(item.direct_term_with_default)
        direct_term = check_term(direct_term)
        direct_term_json = json.dumps(direct_term)

        return render_to_response('unit.html', {
            'context_course': course,
            'unit': item,
            'direct_term': direct_term_json,
            'unit_locator': locator,
            'components': components,
            'component_templates': component_templates,
            'draft_preview_link': preview_lms_link,
            'published_preview_link': lms_link,
            'subsection': containing_subsection,
            'release_date': (
                get_default_time_display(containing_subsection.start)
                if containing_subsection.start is not None else None
            ),
            'section': containing_section,
            'new_unit_category': 'vertical',
            'unit_state': compute_unit_state(item),
            'published_date': (
                get_default_time_display(item.published_date)
                if item.published_date is not None else None
            ),
            'splitters': json.dumps(splitters),
            'options': json.dumps(options)
        })
    else:
        return HttpResponseBadRequest("Only supports html requests")


@login_required
def _get_item_in_course(request, locator):
    """
    Helper method for getting the old location, containing course,
    item, and lms_link for a given locator.

    Verifies that the caller has permission to access this item.
    """
    if not has_access(request.user, locator):
        raise PermissionDenied()

    old_location = loc_mapper().translate_locator_to_location(locator)
    course_location = loc_mapper().translate_locator_to_location(locator, True)
    course = modulestore().get_item(course_location)
    item = modulestore().get_item(old_location, depth=1)
    lms_link = get_lms_link_for_item(old_location, course_id=course.location.course_id)

    return old_location, course, item, lms_link
