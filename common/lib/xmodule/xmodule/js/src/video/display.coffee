class @Video
  constructor: (element) ->
    @el = $(element).find('.video')
    @id = @el.attr('id').replace(/video_/, '')
    @start = @el.data('start')
    @end = @el.data('end')
    @caption_asset_path = @el.data('caption-asset-path')
    @show_captions = @el.data('show-captions')
    window.player = null
    @el = $("#video_#{@id}")
    @parseVideos()
    @fetchMetadata()
    @parseSpeed()
    $("#video_#{@id}").data('video', this).addClass('video-load-complete')

    @hide_captions = $.cookie('hide_captions') == 'true' or (not @show_captions)

    if YT.Player
      @embed()
    else
      window.onYouTubePlayerAPIReady = =>
        @el.each ->
          $(this).data('video').embed()

  youtubeId: (speed)->
    @videos[speed || @speed]

  parseVideos: (videos) ->
    @videos = {}
    if @el.data('youtube-id-0-75')
      @videos['0.75'] = @el.data('youtube-id-0-75')
    if @el.data('youtube-id-1-0')
      @videos['1.0'] = @el.data('youtube-id-1-0')
    if @el.data('youtube-id-1-25')
      @videos['1.25'] = @el.data('youtube-id-1-25')
    if @el.data('youtube-id-1-5')
      @videos['1.50'] = @el.data('youtube-id-1-5')

  getProblems_time: ->
    @problems_time = []
    try
      jsonchik = $("#vert-0").data('problem_time');
      jsoncheg = jsonchik.replace(/'/g,'"').replace(/: u"/g,': "');
      obj_id_time = JSON.parse(jsoncheg);
      problems_count = 0
      for elem in obj_id_time
        if elem.time != 'video'
          hours = elem.time.substr(0,2)
          minutes = elem.time.substr(3,2)
          seconds = elem.time.substr(6,2)
          int_hours = parseInt(hours)
          int_minutes = parseInt(minutes)
          int_seconds = parseInt(seconds)
          time_to_show = int_hours*3600 + int_minutes*60 + int_seconds
          @problems_time[problems_count] = time_to_show
          problems_count++
    catch error
      console.log("You're in CMS")
    @problems_time

  getProblems_id: ->
    @problems_id = []
    try
      jsonchik = $("#vert-0").data('problem_time');
      jsoncheg = jsonchik.replace(/'/g,'"').replace(/: u"/g,': "');
      obj_id_time = JSON.parse(jsoncheg);
      problems_count = 0
      for elem in obj_id_time
        if elem.time != 'video'
          @problems_id[problems_count] = elem.id
          problems_count++
    catch error
      console.log("You're in CMS")
    @problems_id

  parseSpeed: ->
    @setSpeed($.cookie('video_speed'))
    @speeds = ($.map @videos, (url, speed) -> speed).sort()

  setSpeed: (newSpeed) ->
    if @videos[newSpeed] != undefined
      @speed = newSpeed
      $.cookie('video_speed', "#{newSpeed}", expires: 3650, path: '/')
    else
      @speed = '1.0'

  embed: ->
    @player = new VideoPlayer video: this

  fetchMetadata: (url) ->
    @metadata = {}
    $.each @videos, (speed, url) =>
      $.get "https://gdata.youtube.com/feeds/api/videos/#{url}?v=2&alt=jsonc", ((data) => @metadata[data.data.id] = data.data) , 'jsonp'

  getDuration: ->
    @metadata[@youtubeId()].duration

  log: (eventName) ->
    Logger.log eventName,
      id: @id
      code: @youtubeId()
      currentTime: @player.currentTime
      speed: @speed
