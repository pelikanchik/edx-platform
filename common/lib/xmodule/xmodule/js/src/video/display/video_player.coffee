class @VideoPlayer extends Subview
  initialize: ->
    # Define a missing constant of Youtube API
    YT.PlayerState.UNSTARTED = -1

    @currentTime = 0
    @el = $("#video_#{@video.id}")

  bind: ->
    $(@control).bind('play', @play)
      .bind('pause', @pause)
    $(@qualityControl).bind('changeQuality', @handlePlaybackQualityChange)
    $(@caption).bind('seek', @onSeek)
    $(@speedControl).bind('speedChange', @onSpeedChange)
    $(@progressSlider).bind('seek', @onSeek)
    if @volumeControl
      $(@volumeControl).bind('volumeChange', @onVolumeChange)
    $(document.documentElement).keyup @bindExitFullScreen

    @$('.add-fullscreen').click @toggleFullScreen
    @addToolTip() unless onTouchBasedDevice()

  bindExitFullScreen: (event) =>
    if @el.hasClass('fullscreen') && event.keyCode == 27
      @toggleFullScreen(event)

  render: ->
    @control = new VideoControl el: @$('.video-controls')
    @qualityControl = new VideoQualityControl el: @$('.secondary-controls')
    @caption = new VideoCaption
        el: @el
        youtubeId: @video.youtubeId('1.0')
        currentSpeed: @currentSpeed()
        captionAssetPath: @video.caption_asset_path
    unless onTouchBasedDevice()
      @volumeControl = new VideoVolumeControl el: @$('.secondary-controls')
    @speedControl = new VideoSpeedControl el: @$('.secondary-controls'), speeds: @video.speeds, currentSpeed: @currentSpeed()
    @progressSlider = new VideoProgressSlider el: @$('.slider')
    @playerVars =
      controls: 0
      wmode: 'transparent'
      rel: 0
      showinfo: 0
      enablejsapi: 1
      modestbranding: 1
    if @video.start
      @playerVars.start = @video.start
      @playerVars.wmode = 'window'
    if @video.end
      # work in AS3, not HMLT5. but iframe use AS3
      @playerVars.end = @video.end

    @player = new YT.Player @video.id,
      playerVars: @playerVars
      videoId: @video.youtubeId()
      events:
        onReady: @onReady
        onStateChange: @onStateChange
        onPlaybackQualityChange: @onPlaybackQualityChange
    @caption.hideCaptions(@['video'].hide_captions)

  addToolTip: ->
    @$('.add-fullscreen, .hide-subtitles').qtip
      position:
        my: 'top right'
        at: 'top center'

  onReady: (event) =>
    unless onTouchBasedDevice() or $('.video:first').data('autoplay') == 'False'
      $('.video-load-complete:first').data('video').player.play()

  onStateChange: (event) =>
    switch event.data
      when YT.PlayerState.UNSTARTED
        @onUnstarted()
      when YT.PlayerState.PLAYING
        @onPlay()
      when YT.PlayerState.PAUSED
        @onPause()
      when YT.PlayerState.ENDED
        @onEnded()

  onPlaybackQualityChange: (event, value) =>
    quality = @player.getPlaybackQuality()
    @qualityControl.onQualityChange(quality)

  handlePlaybackQualityChange: (event, value) =>
    @player.setPlaybackQuality(value)

  onUnstarted: =>
    @control.pause()
    @caption.pause()

  onPlay: =>
    @video.log 'play_video'
    window.player.pauseVideo() if window.player && window.player != @player
    window.player = @player
    unless @player.interval
      @player.interval = setInterval(@update, 200)
    @caption.play()
    @control.play()
    @progressSlider.play()

  onPause: =>
    @video.log 'pause_video'
    window.player = null if window.player == @player
    clearInterval(@player.interval)
    @player.interval = null
    @caption.pause()
    @control.pause()

  onEnded: =>
    @control.pause()
    @caption.pause()

  onSeek: (event, time) =>
    @player.seekTo(time, true)
    if @isPlaying()
      clearInterval(@player.interval)
      @player.interval = setInterval(@update, 200)
    else
      @currentTime = time
    @updatePlayTime time

  onSpeedChange: (event, newSpeed) =>
    @currentTime = Time.convert(@currentTime, parseFloat(@currentSpeed()), newSpeed)
    newSpeed = parseFloat(newSpeed).toFixed(2).replace /\.00$/, '.0'
    @video.setSpeed(newSpeed)
    @caption.currentSpeed = newSpeed

    if @isPlaying()
      @player.loadVideoById(@video.youtubeId(), @currentTime)
    else
      @player.cueVideoById(@video.youtubeId(), @currentTime)
    @updatePlayTime @currentTime

  onVolumeChange: (event, volume) =>
    @player.setVolume volume

  update: =>
    if @currentTime = @player.getCurrentTime()
      @updatePlayTime @currentTime

  updatePlayTime: (time) ->
    progress = Time.format(time) + ' / ' + Time.format(@duration())
    @$(".vidtime").html(progress)
    @caption.updatePlayTime(time)
    @progressSlider.updatePlayTime(time, @duration())
    int_time = parseInt(time)
    _problems_time = @problems_time()
    for t, i in _problems_time
      if (t is int_time)
        @pause()
        @updatePlayTime(t+1)
        r = i + 1
        index = $("#temp_index_problem").html()
        if index.length == 0
          return_to_video = document.getElementsByClassName("return-to-video")
          return_to_video[0].style.display = 'block'
          iframe = document.getElementById(this.video.id)
          iframe.style.height = '0%'
          frame_problem = document.getElementById("frame_problem")
          frame_problem.style.display = 'block'
          slider = document.getElementsByClassName("slider")
          slider[0].style.display = 'none'
          underslider = document.getElementsByClassName("underslider")
          underslider[0].style.display = 'none'
          $("#temp_index_problem").html(r)
          problem_id = $("#vert-" + r).data('id').replace(/:\/\//,'-').replace(/\//g,'-')
          $("#frame_problem").attr 'data-old-id': problem_id
          $("#problem_" + problem_id).appendTo("#frame_problem")



  toggleFullScreen: (event) =>
    event.preventDefault()
    if @el.hasClass('fullscreen')
      @$('.add-fullscreen').attr('title', 'Fill browser')
      @el.removeClass('fullscreen')
    else
      @el.addClass('fullscreen')
      @$('.add-fullscreen').attr('title', 'Exit fill browser')
    @caption.resize()

  # Delegates
  play: =>
    @player.playVideo() if @player.playVideo

  isPlaying: ->
    @player.getPlayerState() == YT.PlayerState.PLAYING

  pause: =>
    @player.pauseVideo() if @player.pauseVideo

  problems_time: ->
    @video.getProblems_time()

  problems_id: ->
    @video.getProblems_id()

  duration: ->
    @video.getDuration()

  currentSpeed: ->
    @video.speed

  volume: (value) ->
    if value?
      @player.setVolume value
    else
      @player.getVolume()
