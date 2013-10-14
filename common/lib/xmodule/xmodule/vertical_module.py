# -*- coding: utf-8 -*-
import random
import datetime
import json as simplejson
from datetime import datetime, timedelta
from random import sample
from xmodule.x_module import XModule
from xmodule.seq_module import SequenceDescriptor
from xmodule.progress import Progress
from pkg_resources import resource_string
from xblock.fields import Integer, Scope, String
from django.http import HttpResponse



# HACK: This shouldn't be hard-coded to two types
# OBSOLETE: This obsoletes 'type'
class_priority = ['video', 'problem']


class VerticalFields(object):
    has_children = True
    direct_term = String(
        display_name=u"Условие для перенаправления",
        help=u"Условие для перенаправления в другой юнит",
        scope=Scope.settings,
        default='[]'
    )
    random_problem_count = Integer(
        display_name=u"Количество отображаемых задач",
        help=u"Ученику будет показано несколько случайных задач из юнита. Это число определяет количество показываемых задач.",
        scope=Scope.settings,
        default=None
    )
    timeout = Integer(
        display_name=u"Время на прохождение юнита",
        help=u"В секундах.",
        scope=Scope.settings,
        default=None
    )
    time_delay = Integer(
        display_name=u"Время задержки перед следующей попыткой",
        help=u"В секундах.",
        scope=Scope.settings,
        default=None
    )
    next_attempt = String(
        help=u"Время, когда студенту будет доступна новая попытка",
        scope=Scope.user_state
    )

def show_now(child):
    if child.get_icon_class() == 'problem':
        pr_now = child.problem_now
        if pr_now:
            return 'true'
        else:
            return 'false'
    else:
        return 'true'

class VerticalModule(VerticalFields, XModule):
    ''' Layout module for laying out submodules vertically.'''

    def __init__(self, *args, **kwargs):
        XModule.__init__(self, *args, **kwargs)
        self.contents = None


    def set_next_attempt(self, full_date):
        print "\n\n\n\n"
        print full_date
        print "\n\n\n\n"
        self.next_attempt = full_date
        return

    def get_html(self):
        if self.contents is None:
            all_contents = [{
                'id': child.id,
                'content': child.get_html(),
                'father': self.id,
                'direct_term': self.direct_term,
                'progress_detail': Progress.to_js_detail_str(self.get_progress()),
                'type': child.get_icon_class(),
                'attempt_message': "",
                'show_now': show_now(child),
                'problem_time': child.problem_time if child.get_icon_class() == 'problem' else
                [{"id": child2.id if child2.get_icon_class() == 'problem' else "video",
                  "time": child2.problem_time if child2.get_icon_class() == 'problem' else "video",
                  } for child2 in self.get_display_items()],
            } for child in self.get_display_items()]
            if self.random_problem_count is None:
                self.contents = all_contents
            else:
                int_rand_count = int(round(self.random_problem_count))
                if int_rand_count > len(all_contents):
                    int_rand_count = len(all_contents)
                if int_rand_count < 0:
                    int_rand_count = len(all_contents)

                if int_rand_count < len(all_contents):
                    self.contents = random.sample(all_contents, int_rand_count)
                else:
                    self.contents = all_contents

        _time_delay = self.time_delay
        if _time_delay is None:
            _time_delay = 0
        _timeout = self.timeout
        if _timeout is None:
            _timeout = 0
        attempt_message = ""
        if _time_delay > 0:
            current_time = datetime.now()
            #time_array = self.next_attempt.split(":")
            #flag_time = datetime(int(time_array[0]),int(time_array[1]),int(time_array[2]),int(time_array[3]),int(time_array[4]),int(time_array[5]))
            #attempt_message = u"После завершения ответов на вопросы вы сможете ответить заново через " + str(_time_delay) + u" сек. \n Если указанное время прошло, а тест недоступен, пожалуйста, перезагрузите страницу."
            #if flag_time > current_time:
            #    attempt_message = u"Вы сможете снова ответить на вопросы не ранее, чем в " + time_array[3] + u":" + time_array[4] + u":" + time_array[5] + u" " + time_array[2] + u"." + time_array[1] + u"." + time_array[0]

        return self.system.render_template('vert_module.html', {
            'timeout': _timeout,
            'time_delay': _time_delay,
            'attempt_message': attempt_message,
            'items': self.contents,
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

    @property
    def random_show(self):
        count = self.random_problem_count
        if count is None:
            if self.contents is None:
                count = 0
            else:
                count = len(self.contents)
        return count

    @property
    def time_delay_with_default(self):
        count = self.time_delay
        if count is None:
            count = 0
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

    @property
    def time_delay_with_default(self):
        count = self.time_delay
        if count is None:
            count = 0
        return count


    # TODO (victor): Does this need its own definition_to_xml method?  Otherwise it looks
    # like verticals will get exported as sequentials...

