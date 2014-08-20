(function (requirejs, require, define) {

require(
[],
function () {

    window.previous_state_change_time = 0;

    window.GetPlayer = function () {

            if ($.browser.msie) {
                return window["yandex-player"];
            } else {
                return document["yandex-player"];
            }
        };

    window.ShowBackshot = function(self) {
             self.fadeIn(200);
             self.attr("shown","1");
             self.addClass("shown");
             GetPlayer().pauseVideo();
    };

    window.HideBackshot = function(self) {
             self.fadeOut(200);
             self.removeClass("shown");
    };

        
    window.onPlayerStateChange = function(state) {
            // state == play - с временным интервалом идут обращения к плееру с попыткой получить текущее время
            // state == pause - очистка setInterval
            // state == end - очистка setInterval
            function timeToInt(elem){
                var hours = elem.substr(0,2);
                var minutes = elem.substr(3,2);
                var seconds = elem.substr(6,2);
                var int_hours = parseInt(hours);
                var int_minutes = parseInt(minutes);
                var int_seconds = parseInt(seconds);
                return int_hours * 3600 + int_minutes * 60 + int_seconds;
            }


            var intervalStorage = $('#yandex-player').parent();
            var videoBlockId = "yandex-player";
            if (state == "play" ){

                $('li.backshot').each(function() {
                    if ($(this).hasClass("shown")){
                        HideBackshot($(this));
                    }
                });

                clearInterval(intervalStorage.data("interval-id"));
                intervalStorage.removeData("interval-id");
                intervalStorage.data("interval-id", setInterval(function(){

                    state_change_time = GetPlayer().getCurrentTime();
                    // Если время прокрутилось назад - сбросить метки просмотра у всех последующих бэкшотов
                    if (previous_state_change_time > state_change_time || state_change_time == 0){
                        $('li.backshot').each(function() {
                            var time_to_show = timeToInt($(this).data('problem_time'));
                            if (time_to_show > state_change_time){
                                $(this).attr("shown","0");
                            }
                        });
                    }

                    previous_state_change_time = state_change_time;


                    if (intervalStorage.data("interval-id")){
 
                        $('li.backshot').each(function() {
                            var time_to_show =  timeToInt($(this).data('problem_time'));
                            var difference_between_now_and_showtime = GetPlayer().getCurrentTime() - time_to_show;
                            if (difference_between_now_and_showtime < 0.8 && difference_between_now_and_showtime > 0){
                                if ($(this).attr("shown")!="1"){
                                    ShowBackshot($(this));
                                }
                            }
                        });
                    }
                },400));


            }
            else if (state == "pause" || state == "end"){
                clearInterval(intervalStorage.data("interval-id"));
                intervalStorage.removeData("interval-id");
            }

        }

    window.Video = function () {

        $('#play').click(function(event){
            GetPlayer().seekTo(20);
            event.preventDefault();
        });

        $('#pause').click(function(event){
            GetPlayer().pauseVideo();
            event.preventDefault();
        });

        $('.video  > section > input').click(function() {
          return $('#seq_content').trigger('godynamo');
        });
    };

});

}(RequireJS.requirejs, RequireJS.require, RequireJS.define));