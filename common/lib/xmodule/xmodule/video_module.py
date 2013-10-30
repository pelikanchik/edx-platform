# -*- coding: utf-8 -*-
# pylint: disable=W0223
"""Video is ungraded Xmodule for support video content.
It's new improved video module, which support additional feature:

- Can play non-YouTube video sources via in-browser HTML5 video player.
- YouTube defaults to HTML5 mode from the start.
- Speed changes in both YouTube and non-YouTube videos happen via
in-browser HTML5 video method (when in HTML5 mode).
- Navigational subtitles can be disabled altogether via an attribute
in XML.
"""

import json
import logging

from lxml import etree
from pkg_resources import resource_string

from django.http import Http404
from django.conf import settings

from xmodule.x_module import XModule
from xmodule.editing_module import TabsEditingDescriptor
from xmodule.raw_module import EmptyDataRawDescriptor
from xmodule.xml_module import is_pointer_tag, name_to_pathname
from xmodule.modulestore import Location
from xblock.core import Scope, String, Boolean, Float, List, Integer

import datetime
import time

log = logging.getLogger(__name__)


class VideoFields(object):
    """Fields for `VideoModule` and `VideoDescriptor`."""
    display_name = String(
#<<<<<<< HEAD
        display_name="Display Name", help="Display name for this module.",
        default="Video",
        scope=Scope.settings
    )
    position = Integer(
        help="Current position in the video",
        scope=Scope.user_state,
        default=0
    )
    show_captions = Boolean(
        help="This controls whether or not captions are shown by default.",
        display_name="Show Captions",
        scope=Scope.settings,
        default=True
    )
    # TODO: This should be moved to Scope.content, but this will
    # require data migration to support the old video module.
    youtube_id_1_0 = String(
        help="This is the Youtube ID reference for the normal speed video.",
        display_name="Youtube ID",
        scope=Scope.settings,
        default="OEoXaMPEzfM"
    )
    youtube_id_0_75 = String(
        help="The Youtube ID for the .75x speed video.",
        display_name="Youtube ID for .75x speed",
        scope=Scope.settings,
        default=""
    )
    youtube_id_1_25 = String(
        help="The Youtube ID for the 1.25x speed video.",
        display_name="Youtube ID for 1.25x speed",
        scope=Scope.settings,
        default=""
    )
    youtube_id_1_5 = String(
        help="The Youtube ID for the 1.5x speed video.",
        display_name="Youtube ID for 1.5x speed",
        scope=Scope.settings,
        default=""
    )
    start_time = Float(
        help="Start time for the video.",
        display_name="Start Time",
        scope=Scope.settings,
        default=0.0
    )
    end_time = Float(
        help="End time for the video.",
        display_name="End Time",
        scope=Scope.settings,
        default=0.0
    )
    source = String(
        help="The external URL to download the video. This appears as a link beneath the video.",
        display_name="Download Video",
        scope=Scope.settings,
        default=""
    )
    html5_sources = List(
        help="A list of filenames to be used with HTML5 video. The first supported filetype will be displayed.",
        display_name="Video Sources",
        scope=Scope.settings,
        default=[]
    )
    track = String(
        help="The external URL to download the timed transcript track. This appears as a link beneath the video.",
        display_name="Download Track",
        scope=Scope.settings,
        default=""
    )
    sub = String(
        help="The name of the timed transcript track (for non-Youtube videos).",
        display_name="HTML5 Timed Transcript",
        scope=Scope.settings,
        default=""
    )
#=======
#        display_name=u"Отображаемое имя",
#        help=u"Это имя появляется в горизонтальной навигации наверху страницы.",
#        scope=Scope.settings,
#        # it'd be nice to have a useful default but it screws up other things; so,
#        # use display_name_with_default for those
#        default=u"Видео"
#    )
#    data = String(
#        help=u"XML-данные",
#        default='',
#        scope=Scope.content
#    )
#    position = Integer(help=u"Текущая позиция в видео", scope=Scope.user_state, default=0)
#    show_captions = Boolean(help=u"Управляет, показываются ли по умолчанию заголовки.", display_name=u"Показывать заголовки", scope=Scope.settings, default=True)
#    youtube_id_1_0 = String(help=u"YouTube ID для видео нормальной скорости.", display_name=u"Обычная скорость", scope=Scope.settings, default="OEoXaMPEzfM")
#    youtube_id_0_75 = String(help=u"Youtube ID для видео скорости 0.75x.", display_name=u"Скорость: .75x", scope=Scope.settings, default="")
#    youtube_id_1_25 = String(help=u"Youtube ID для видео скорости 1.25x", display_name=u"Скорость: 1.25x", scope=Scope.settings, default="")
#    youtube_id_1_5 = String(help=u"Youtube ID для видео скорости 1.5x", display_name=u"Скорость: 1.5x", scope=Scope.settings, default="")
#    start_time = Float(help=u"Время запуска видео", display_name=u"Время начала", scope=Scope.settings, default=0.0)
#    end_time = Float(help=u"Время, когда показ видео закончится", display_name=u"Время окончания", scope=Scope.settings, default=0.0)
#    source = String(help=u"Внешняя ссылка на видеофайл.", display_name=u"Скачать видео", scope=Scope.settings, default="")
#    track = String(help=u"Внешняя ссылка на субтитры.", display_name=u"Скачать субтитры", scope=Scope.settings, default="")
#>>>>>>> 4f9bf342df105f2a5f00372194e6f7a65dac6f8b


class VideoModule(VideoFields, XModule):
    """
    XML source example:

        <video show_captions="true"
            youtube="0.75:jNCf2gIqpeE,1.0:ZwkTiUPN0mg,1.25:rsq9auxASqI,1.50:kMyNdzVHHgg"
            url_name="lecture_21_3" display_name="S19V3: Vacancies"
        >
            <source src=".../mit-3091x/M-3091X-FA12-L21-3_100.mp4"/>
            <source src=".../mit-3091x/M-3091X-FA12-L21-3_100.webm"/>
            <source src=".../mit-3091x/M-3091X-FA12-L21-3_100.ogv"/>
        </video>
    """
    video_time = 0
    icon_class = 'video'

    js = {
        'js': [
            resource_string(__name__, 'js/src/video/01_initialize.js'),
            resource_string(__name__, 'js/src/video/02_html5_video.js'),
            resource_string(__name__, 'js/src/video/03_video_player.js'),
            resource_string(__name__, 'js/src/video/04_video_control.js'),
            resource_string(__name__, 'js/src/video/05_video_quality_control.js'),
            resource_string(__name__, 'js/src/video/06_video_progress_slider.js'),
            resource_string(__name__, 'js/src/video/07_video_volume_control.js'),
            resource_string(__name__, 'js/src/video/08_video_speed_control.js'),
            resource_string(__name__, 'js/src/video/09_video_caption.js'),
            resource_string(__name__, 'js/src/video/10_main.js')
        ]
    }
    css = {'scss': [resource_string(__name__, 'css/video/display.scss')]}
    js_module_name = "Video"

    def handle_ajax(self, dispatch, data):
        """This is not being called right now and we raise 404 error."""
        log.debug(u"GET {0}".format(data))
        log.debug(u"DISPATCH {0}".format(dispatch))
        raise Http404()


    def get_instance_state(self):
        """Return information about state (position)."""
        return json.dumps({'position': self.position})

    def get_html(self):
        caption_asset_path = "/static/subs/"

        get_ext = lambda filename: filename.rpartition('.')[-1]
        sources = {get_ext(src): src for src in self.html5_sources}
        sources['main'] = self.source

        return self.system.render_template('video.html', {
            'youtube_streams': _create_youtube_string(self),
            'id': self.location.html_id(),
            'sub': self.sub,
            'sources': sources,
            'track': self.track,
            'display_name': self.display_name_with_default,
            # This won't work when we move to data that
            # isn't on the filesystem
            'data_dir': getattr(self, 'data_dir', None),
            'caption_asset_path': caption_asset_path,
            'show_captions': json.dumps(self.show_captions),
            'start': self.start_time,
            'end': self.end_time,
            'autoplay': settings.MITX_FEATURES.get('AUTOPLAY_VIDEOS', True)
        })


class VideoDescriptor(VideoFields, TabsEditingDescriptor, EmptyDataRawDescriptor):
    """Descriptor for `VideoModule`."""
    module_class = VideoModule

    tabs = [
        # {
        #     'name': "Subtitles",
        #     'template': "video/subtitles.html",
        # },
        {
            'name': "Settings",
            'template': "tabs/metadata-edit-tab.html",
            'current': True
        }
    ]

    def __init__(self, *args, **kwargs):
        super(VideoDescriptor, self).__init__(*args, **kwargs)
#<<<<<<< HEAD
        # For backwards compatibility -- if we've got XML data, parse
        # it out and set the metadata fields
        if self.data:
            model_data = VideoDescriptor._parse_video_xml(self.data)
            self._model_data.update(model_data)
            del self.data
#=======
        # If we don't have a `youtube_id_1_0`, this is an XML course
        # and we parse out the fields.
#        if self.data and 'youtube_id_1_0' not in self._model_data:
#            _parse_video_xml(self, self.data)
#
    @property
    def get_class(self):
        return "VideoDescriptor"
#
#    @property
#    def non_editable_metadata_fields(self):
#        non_editable_fields = super(MetadataOnlyEditingDescriptor, self).non_editable_metadata_fields
#        non_editable_fields.extend([VideoModule.start_time,
#                                    VideoModule.end_time])
#        return non_editable_fields
#>>>>>>> 4f9bf342df105f2a5f00372194e6f7a65dac6f8b

    @classmethod
    def from_xml(cls, xml_data, system, org=None, course=None):
        """
        Creates an instance of this descriptor from the supplied xml_data.
        This may be overridden by subclasses

        xml_data: A string of xml that will be translated into data and children for
            this module
        system: A DescriptorSystem for interacting with external resources
        org and course are optional strings that will be used in the generated modules
            url identifiers
        """
        xml_object = etree.fromstring(xml_data)
        url_name = xml_object.get('url_name', xml_object.get('slug'))
        location = Location(
            'i4x', org, course, 'video', url_name
        )
        if is_pointer_tag(xml_object):
            filepath = cls._format_filepath(xml_object.tag, name_to_pathname(url_name))
            xml_data = etree.tostring(cls.load_file(filepath, system.resources_fs, location))
        model_data = VideoDescriptor._parse_video_xml(xml_data)
        model_data['location'] = location
        video = cls(system, model_data)
        return video

    def definition_to_xml(self, resource_fs):
        """
        Returns an xml string representing this module.
        """
        xml = etree.Element('video')
        youtube_string = _create_youtube_string(self)
        # Mild workaround to ensure that tests pass -- if a field
        # is set to its default value, we don't need to write it out.
        if youtube_string == '1.00:OEoXaMPEzfM':
            youtube_string = ''
        attrs = {
            'display_name': self.display_name,
            'show_captions': json.dumps(self.show_captions),
            'youtube': youtube_string,
            'start_time': datetime.timedelta(seconds=self.start_time),
            'end_time': datetime.timedelta(seconds=self.end_time),
            'sub': self.sub,
            'url_name': self.url_name
        }
        fields = {field.name: field for field in self.fields}
        for key, value in attrs.items():
            # Mild workaround to ensure that tests pass -- if a field
            # is set to its default value, we don't need to write it out.
            if key in fields and fields[key].default == getattr(self, key):
                continue
            if value:
                xml.set(key, unicode(value))

        for source in self.html5_sources:
            ele = etree.Element('source')
            ele.set('src', source)
            xml.append(ele)

        if self.track:
            ele = etree.Element('track')
            ele.set('src', self.track)
            xml.append(ele)
        return xml

    @staticmethod
    def _parse_youtube(data):
        """
        Parses a string of Youtube IDs such as "1.0:AXdE34_U,1.5:VO3SxfeD"
        into a dictionary. Necessary for backwards compatibility with
        XML-based courses.
        """
        ret = {'0.75': '', '1.00': '', '1.25': '', '1.50': ''}

        videos = data.split(',')
        for video in videos:
            pieces = video.split(':')
            try:
                speed = '%.2f' % float(pieces[0])  # normalize speed

                # Handle the fact that youtube IDs got double-quoted for a period of time.
                # Note: we pass in "VideoFields.youtube_id_1_0" so we deserialize as a String--
                # it doesn't matter what the actual speed is for the purposes of deserializing.
                youtube_id = VideoDescriptor._deserialize(VideoFields.youtube_id_1_0.name, pieces[1])
                ret[speed] = youtube_id
            except (ValueError, IndexError):
                log.warning('Invalid YouTube ID: %s' % video)
        return ret

    @staticmethod
    def _parse_video_xml(xml_data):
        """
        Parse video fields out of xml_data. The fields are set if they are
        present in the XML.
        """
        xml = etree.fromstring(xml_data)
        model_data = {}

        conversions = {
            'start_time': VideoDescriptor._parse_time,
            'end_time': VideoDescriptor._parse_time
        }

        # Convert between key names for certain attributes --
        # necessary for backwards compatibility.
        compat_keys = {
            'from': 'start_time',
            'to': 'end_time'
        }

        sources = xml.findall('source')
        if sources:
            model_data['html5_sources'] = [ele.get('src') for ele in sources]
            model_data['source'] = model_data['html5_sources'][0]

        track = xml.find('track')
        if track is not None:
            model_data['track'] = track.get('src')

        for attr, value in xml.items():
            if attr in compat_keys:
                attr = compat_keys[attr]
            if attr in VideoDescriptor.metadata_to_strip + ('url_name', 'name'):
                continue
            if attr == 'youtube':
                speeds = VideoDescriptor._parse_youtube(value)
                for speed, youtube_id in speeds.items():
                    # should have made these youtube_id_1_00 for
                    # cleanliness, but hindsight doesn't need glasses
                    normalized_speed = speed[:-1] if speed.endswith('0') else speed
                    # If the user has specified html5 sources, make sure we don't use the default video
                    if youtube_id != '' or 'html5_sources' in model_data:
                        model_data['youtube_id_{0}'.format(normalized_speed.replace('.', '_'))] = youtube_id
            else:
                #  Convert XML attrs into Python values.
                if attr in conversions:
                    value = conversions[attr](value)
                else:
                # We export values with json.dumps (well, except for Strings, but
                # for about a month we did it for Strings also).
                    value = VideoDescriptor._deserialize(attr, value)
                model_data[attr] = value

        return model_data

    @classmethod
    def _deserialize(cls, attr, value):
        """
        Handles deserializing values that may have been encoded with json.dumps.
        """
        return cls.get_map_for_field(attr).from_xml(value)

    @staticmethod
    def _parse_time(str_time):
        """Converts s in '12:34:45' format to seconds. If s is
        None, returns empty string"""
        if not str_time:
            return ''
        else:
            obj_time = time.strptime(str_time, '%H:%M:%S')
            return datetime.timedelta(
                hours=obj_time.tm_hour,
                minutes=obj_time.tm_min,
                seconds=obj_time.tm_sec
            ).total_seconds()


def _create_youtube_string(module):
    """
    Create a string of Youtube IDs from `module`'s metadata
    attributes. Only writes a speed if an ID is present in the
    module.  Necessary for backwards compatibility with XML-based
    courses.
    """
#<<<<<<< HEAD
    youtube_ids = [
        module.youtube_id_0_75,
        module.youtube_id_1_0,
        module.youtube_id_1_25,
        module.youtube_id_1_5
    ]
    youtube_speeds = ['0.75', '1.00', '1.25', '1.50']
    return ','.join([':'.join(pair)
                     for pair
                     in zip(youtube_speeds, youtube_ids)
                     if pair[1]])
#=======
#    ret = {'0.75': 'slow', '1.00': 'norm', '1.25': 'fast', '1.50': 'xfast'}
#    if data == '':
#        return ret
#    videos = data.split(',')
#    for video in videos:
#        pieces = video.split(':')
        # HACK
        # To elaborate somewhat: in many LMS tests, the keys for
        # Youtube IDs are inconsistent. Sometimes a particular
        # speed isn't present, and formatting is also inconsistent
        # ('1.0' versus '1.00'). So it's necessary to either do
        # something like this or update all the tests to work
        # properly.
#        ret['%.2f' % float(pieces[0])] = pieces[1]
#    return ret


#def _parse_time(str_time):
#    """Converts s in '12:34:45' format to seconds. If s is
#    None, returns empty string"""
#    if str_time is None or str_time == '':
#        return ''
#    else:
#        obj_time = time.strptime(str_time, '%H:%M:%S')
#        return datetime.timedelta(
#            hours=obj_time.tm_hour,
#            minutes=obj_time.tm_min,
#            seconds=obj_time.tm_sec
#        ).total_seconds()
#>>>>>>> 4f9bf342df105f2a5f00372194e6f7a65dac6f8b
