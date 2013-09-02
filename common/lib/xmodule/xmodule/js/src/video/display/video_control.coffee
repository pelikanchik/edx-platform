class @VideoControl extends Subview
  bind: ->
    @$('.return-to-video').click @returnVideo
    @$('.video_control').click @togglePlayback

  render: ->
    @el.append """
      <div class="slider"></div>
      <div class="underslider">
        <ul class="vcr">
          <li><a class="video_control" href="#"></a></li>
          <li>
            <div class="vidtime">0:00 / 0:00</div>
          </li>
        </ul>
        <div class="secondary-controls">
          <a href="#" class="add-fullscreen" title="Fill browser">Fill Browser</a>
        </div>
      </div>
      </div>
      """#"

    unless onTouchBasedDevice()
      @$('.video_control').addClass('play').html('Play')

  play: ->
    @$('.video_control').removeClass('play').addClass('pause').html('Pause')

  pause: ->
    @$('.video_control').removeClass('pause').addClass('play').html('Play')

  returnVideo: ->
      frame_problem = document.getElementById("frame_problem")
      frame_problem.style.display = 'none'
      control_id = @id.substr(16)
      iframe = document.getElementById(control_id)
      iframe.style.height = '100%'
      slider = document.getElementsByClassName("slider")
      slider[0].style.display = 'block'
      underslider = document.getElementsByClassName("underslider")
      underslider[0].style.display = 'block'
      @style.display = 'none'
      r = $("#temp_index_problem").html()
      $("#temp_index_problem").html("")
      problem_id = $("#frame_problem").attr("data-old-id")
      cur_vert = $("#vert-" + r)
      cur_class = cur_vert.find(".xmodule_display.xmodule_CapaModule")
      cur_class.html("")
      $("#problem_" + problem_id).appendTo(cur_class)
      $("#frame_problem").html("")


  togglePlayback: (event) =>
    event.preventDefault()
    if @$('.video_control').hasClass('play')
      $(@).trigger('play')
    else if @$('.video_control').hasClass('pause')
      $(@).trigger('pause')
