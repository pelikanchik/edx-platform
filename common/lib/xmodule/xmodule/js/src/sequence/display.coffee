class @Sequence
  constructor: (element) ->
    @el = $(element).find('.sequence')
    @contents = @$('.seq_contents')
    @num_contents = @contents.length
    @id = @el.data('id')
    @modx_url = @el.data('course_modx_root')
    @next_attempt_set = @el.data('next_attempt_set')
    @initProgress()
    @bind()
    @render parseInt(@el.data('position'))

  $: (selector) ->
    $(selector, @el)

  bind: =>
    @$('#sequence-list a').click @goto
    @$('.finish-test').click @finish_test


  initProgress: ->
    @progressTable = {} # "#problem_#{id}" -> progress


  hookUpProgressEvent: ->
    $('.problems-wrapper').bind 'progressChanged', @updateProgress

  mergeProgress: (p1, p2) ->
    # if either is "NA", return the other one
    if p1 == "NA"
      return p2
    if p2 == "NA"
      return p1

    # Both real progresses
    if p1 == "done" and p2 == "done"
      return "done"

    # not done, so if any progress on either, in_progress
    w1 = p1 == "done" or p1 == "in_progress"
    w2 = p2 == "done" or p2 == "in_progress"
    if w1 or w2
      return "in_progress"

    return "none"

  updateProgress: =>
    new_progress = "NA"
    _this = this
    $('.problems-wrapper').each (index) ->
      progress = $(this).data 'progress_status'
      new_progress = _this.mergeProgress progress, new_progress

    @progressTable[@position] = new_progress
    @setProgress(new_progress, @link_for(@position))

  setProgress: (progress, element) ->
      # If progress is "NA", don't add any css class
      element.removeClass('progress-none')
             .removeClass('progress-some')
             .removeClass('progress-done')

      switch progress
        when 'none' then element.addClass('progress-none')
        when 'in_progress' then element.addClass('progress-some')
        when 'done' then element.addClass('progress-done')

  toggleArrows: =>
    @$('.sequence-nav-buttons a').unbind('click')
    @$('.sequence-nav-buttons .godynamo a').removeClass('disabled').click(@godynamo)

    if @contents.length == 0
      @$('.sequence-nav-buttons .prev a').addClass('disabled')
      @$('.sequence-nav-buttons .next a').addClass('disabled')
      return

    if @position == 1
      @$('.sequence-nav-buttons .prev a').addClass('disabled')
    else
      @$('.sequence-nav-buttons .prev a').removeClass('disabled').click(@previous)

    if @position == @contents.length
      @$('.sequence-nav-buttons .next a').addClass('disabled')
    else
      @$('.sequence-nav-buttons .next a').removeClass('disabled').click(@next)

  render: (new_position) ->
    if @position != new_position
      if @position != undefined
        @mark_visited @position
        modx_full_url = @modx_url + '/' + @id + '/goto_position'
        $.postWithPrefix modx_full_url, position: new_position

      # On Sequence change, fire custom event "sequence:change" on element.
      # Added for aborting video bufferization, see ../video/10_main.js
      @el.trigger "sequence:change"
      @mark_active new_position
      @$('#seq_content').html @contents.eq(new_position - 1).text()

      XModule.loadModules(@$('#seq_content'))

      #MathJax.Hub.Queue(["Typeset", MathJax.Hub, "seq_content"]) # NOTE: Actually redundant. Some other MathJax call also being performed
      window.update_schematics() # For embedded circuit simulator exercises in 6.002x

      @position = new_position

      @toggleArrows()
      @hookUpProgressEvent()

      sequence_links = @$('#seq_content a.seqnav')
      sequence_links.click @goto
      @timeout = @contents.eq(@position - 1).data("timeout")
      @time_next_attempt = @contents.eq(@position - 1).data("next_attempt")
      @availability = @contents.eq(@position - 1).data("availability")
      $('#seq_content')[0].setAttribute("timeout", @timeout)
      $('#seq_content')[0].setAttribute("next_attempt", @time_next_attempt)
      $('#seq_content')[0].setAttribute("availability", @availability)
      if @timeout > 0
        @$('.attempt-message').css("display","block")
        @$('.dialog-finish-test').css("display","block")
      else
        @$('.attempt-message').css("display","none")
        @$('.dialog-finish-test').css("display","none")

      @disable_check_buttons()
      @total_seconds = @timeout
      @time_check()
      @enable_button()

  time_check: ->
    time_now = new Date()
    array_now = []
    array_next_attempt = []
    array_next_attempt_str = @time_next_attempt.split(":")
    i = 0
    _i = 0
    _len = array_next_attempt_str.length
    while _i < _len
      elem = array_next_attempt_str[_i]
      array_next_attempt[i] = parseInt(elem)
      i++
      _i++
    array_now[0] = parseInt(time_now.getFullYear())
    array_now[1] = parseInt(time_now.getMonth()) + 1
    array_now[2] = parseInt(time_now.getDate())
    array_now[3] = parseInt(time_now.getHours())
    array_now[4] = parseInt(time_now.getMinutes())
    array_now[5] = parseInt(time_now.getSeconds())
    i = _j = 0
    while _j < 5
      if array_now[i] < array_next_attempt[i]
        @total_seconds = (array_next_attempt[5] - array_now[5]) + 60 * (array_next_attempt[4] - array_now[4]) + 60 * 60 * (array_next_attempt[3] - array_now[3]) + 60 * 60 * 24 * (array_next_attempt[2] - array_now[2])
        @total_seconds = @total_seconds + 60 * 60 * 24 * 31  if array_now[2] > array_next_attempt[2]
        @total_seconds = @total_seconds + 60 * 60 * 24 * 366  if array_now[1] > array_next_attempt[1]
        return false
      if array_now[i] > array_next_attempt[i]
        @total_seconds = 0
        return true
      i = ++_j
    true

  finish_test: ->

    modx_full_url = @modx_url + "/" + @id + "/change_attempt_time"
    $(".finish-test").attr "disabled", true
    $(".dialog-finish-test").attr "disabled", true
    _availability = $("#seq_content")[0].getAttribute("availability")
    _availability_array = JSON.parse(_availability.split("'").join("\""))
    _i = 0
    _len = _availability_array.length
    while _i < _len
      el = _availability_array[_i]
      string_id = "problem_" + el["id"].split("://").join("-").split("/").join("-")
      el.test_status = "unavailable"
      status = el.test_status
      console.log string_id + " " + status
      @disable_one_check_button string_id, status
      _i++
    _av_string = JSON.stringify(_availability_array)
    _av_string_corr = _av_string.split("\"").join("'")
    $("#seq_content")[0].setAttribute "availability", _av_string_corr
    seqs = document.getElementsByClassName("seq_contents tex2jax_ignore asciimath2jax_ignore")
    seqs[_this.position - 1].setAttribute "data-availability", _av_string_corr
    console.log seqs[_this.position - 1].getAttribute("data-availability")
    $.postWithPrefix modx_full_url, (response) ->
      _this.time_next_attempt = response.next_attempt
      _this.contents.eq(_this.position - 1).attr "data-next_attempt", _this.time_next_attempt
      $("#seq_content")[0].setAttribute "next_attempt", _this.time_next_attempt
      seqs = document.getElementsByClassName("seq_contents tex2jax_ignore asciimath2jax_ignore")
      seqs[_this.position - 1].setAttribute "data-next_attempt", _this.time_next_attempt
      _this.time_check()
      _this.enable_button()


  enable_button: ->
    if @total_seconds < 1
      $(".finish-test").removeAttr "disabled"
      $(".dialog-finish-test").removeAttr "disabled"
      _availability = $("#seq_content")[0].getAttribute("availability")
      _av_json = JSON.parse(_availability.split("'").join("\""))
      _i = 0
      _len = _av_json.length
      while _i < _len
        el = _av_json[_i]
        if el["test_status"] isnt "unanswered"
          el["test_status"] = "unanswered"
          string_id = "problem_" + el["id"].split("://").join("-").split("/").join("-")
          status = el["test_status"]
          @disable_one_check_button string_id, status
        _i++
      _av_string = JSON.stringify(_av_json)
      _av_string_corr = _av_string.split("\"").join("'")
      $("#seq_content")[0].setAttribute "availability", _av_string_corr
      seqs = document.getElementsByClassName("seq_contents tex2jax_ignore asciimath2jax_ignore")
      console.log seqs.length
      console.log @position
      seqs[@position - 1].setAttribute "data-availability", _av_string_corr
      console.log seqs[@position - 1].getAttribute("data-availability")
      _total_seconds = @contents.eq(@position - 1).data("timeout")
      _seconds = _total_seconds % 60
      _minutes = ((_total_seconds - _seconds) / 60) % 60
      _hours = ((_total_seconds - _seconds - _minutes * 60) / 60) % 24
      _days = (_total_seconds - _seconds - _minutes * 60 - _hours * 3600) / 24
      _messag = ""
      _messag = _messag + _days + " д. "  if _days > 0
      _messag = _messag + _hours + " ч. "  if _hours > 0
      _messag = _messag + _minutes + " мин. "  if _minutes > 0
      _messag = _messag + _seconds + " сек. "  if _seconds > 0
      @$(".attempt-message").html "После завершения ответов на вопросы вы сможете ответить заново через " + _messag + " \n Если указанное время прошло, а тест недоступен, пожалуйста, обновите страницу."
    else
      $(".finish-test").attr "disabled", true
      $(".dialog-finish-test").attr "disabled", true
      time_now = new Date()
      array_now = []
      array_next_attempt = []
      array_next_attempt_str = @time_next_attempt.split(":")
      i = 0
      _j = 0
      _len1 = array_next_attempt_str.length
      while _j < _len1
        elem = array_next_attempt_str[_j]
        array_next_attempt[i] = parseInt(elem)
        i++
        _j++
      array_now[0] = parseInt(time_now.getFullYear())
      array_now[1] = parseInt(time_now.getMonth()) + 1
      array_now[2] = parseInt(time_now.getDate())
      array_now[3] = parseInt(time_now.getHours())
      array_now[4] = parseInt(time_now.getMinutes())
      array_now[5] = parseInt(time_now.getSeconds())
      i = 0
      while i < 6
        if array_now[i] > array_next_attempt[i]
          @total_seconds = 0
          @enable_button()
        if array_now[i] < array_next_attempt[i]
          i = 6
          break
        i++
      _total_seconds = array_next_attempt[5] - array_now[5] + (array_next_attempt[4] - array_now[4]) * 60 + (array_next_attempt[3] - array_now[3]) * 60 * 60 + (array_next_attempt[2] - array_now[2]) * 60 * 60 * 24
      if _total_seconds < 0
        @total_seconds = 1200
        @$(".attempt-message").html "Вы сможете снова ответить на вопросы не ранее, чем в " + array_next_attempt_str[3] + ":" + array_next_attempt_str[4] + ":" + array_next_attempt_str[5] + " " + array_next_attempt_str[2] + "." + array_next_attempt_str[1] + "." + array_next_attempt_str[0]
      else if _total_seconds > 1200
        @total_seconds = 1200
        @$(".attempt-message").html "Вы сможете снова ответить на вопросы не ранее, чем в " + array_next_attempt_str[3] + ":" + array_next_attempt_str[4] + ":" + array_next_attempt_str[5] + " " + array_next_attempt_str[2] + "." + array_next_attempt_str[1] + "." + array_next_attempt_str[0]
      else
        @total_seconds = _total_seconds
        _seconds = _total_seconds % 60
        _minutes = (_total_seconds - _seconds) / 60
        _seconds_str = _seconds + ""
        _seconds_str = "0" + _seconds_str  if _seconds < 10
        @$(".attempt-message").html "Вы сможете снова ответить на вопросы не ранее, чем в " + array_next_attempt[3] + ":" + array_next_attempt[4] + ":" + array_next_attempt[5] + " " + array_next_attempt[2] + "." + array_next_attempt[1] + "." + array_next_attempt[0] + ". \n\n Осталось " + _minutes + ":" + _seconds_str
        setTimeout @enable_button, 1000
    disable_check_buttons: ->
      _availability = @availability.split("'").join('"')
      _availability_array = JSON.parse(_availability)
      for el in _availability_array
        string_id = "problem_" + el["id"].split("://").join("-").split("/").join("-")
        status = el.test_status
        @disable_one_check_button(string_id, status)

  disable_one_check_button: (string_id, status) =>
    check_b = $("#" + string_id + " .check")
    if check_b.length > 0
      if status is "answered"
        check_b.val "Принято"
        check_b.attr "disabled", true
      if status is "unanswered"
        check_b.val "Ответить"
        check_b.attr "disabled", false
      if status is "unavailable"
        check_b.val "Недоступно"
        check_b.attr "disabled", true
    else
      setTimeout @disable_one_check_button, 1000, string_id, status


  goto: (event) =>
    event.preventDefault()
    if $(event.target).hasClass 'seqnav' # Links from courseware <a class='seqnav' href='n'>...</a>
      new_position = $(event.target).attr('href')
    else # Tab links generated by backend template
      new_position = $(event.target).data('element')

    if (1 <= new_position) and (new_position <= @num_contents)
      Logger.log "seq_goto", old: @position, new: new_position, id: @id

      analytics.pageview @id

      # navigation by clicking the tab directly
      analytics.track "Accessed Sequential Directly",
        sequence_id: @id
        current_sequential: @position
        target_sequential: new_position

      # On Sequence change, destroy any existing polling thread
      # for queued submissions, see ../capa/display.coffee
      if window.queuePollerID
        window.clearTimeout(window.queuePollerID)
        delete window.queuePollerID

      @render new_position
    else
      alert 'Sequence error! Cannot navigate to tab ' + new_position + 'in the current SequenceModule. Please contact the course staff.'

  next: (event) => @_change_sequential 'seq_next', event
  previous: (event) => @_change_sequential 'seq_prev', event

  # `direction` can be 'seq_prev' or 'seq_next'
  _change_sequential: (direction, event) =>
    # silently abort if direction is invalid.
    return unless direction in ['seq_prev', 'seq_next']

    event.preventDefault()
    offset =
      seq_next: 1
      seq_prev: -1
    new_position = @position + offset[direction]
    Logger.log direction,
      old: @position
      new: new_position
      id: @id

    analytics.pageview @id

    # navigation using the next or previous arrow button.
    tracking_messages =
      seq_prev: "Accessed Previous Sequential"
      seq_next: "Accessed Next Sequential"
    analytics.track tracking_messages[direction],
      sequence_id: @id
      current_sequential: @position
      target_sequential: new_position

    # If the bottom nav is used, scroll to the top of the page on change.
    if $(event.target).closest('nav[class="sequence-bottom"]').length > 0
      $.scrollTo 0, 150
    @render new_position


  godynamo: (event) =>
    event.preventDefault()

    modx_full_url = @modx_url + '/' + @id + "/dynamo"
    $.postWithPrefix modx_full_url, (response) =>
      new_position = response.position
      Logger.log "seq_godynamo", old: @position, new: new_position, id: @id

      analytics.pageview @id

      analytics.track "Accessed Previous Sequential",
        sequence_id: @id
        current_sequential: @position
        target_sequential: new_position

      @render new_position

  link_for: (position) ->
    @$("#sequence-list a[data-element=#{position}]")

  mark_visited: (position) ->
    # Don't overwrite class attribute to avoid changing Progress class
    element = @link_for(position)
    element.removeClass("inactive")
    .removeClass("active")
    .addClass("visited")

  mark_active: (position) ->
    # Don't overwrite class attribute to avoid changing Progress class
    element = @link_for(position)
    element.removeClass("inactive")
    .removeClass("visited")
    .addClass("active")

  @inputAjax: (url, data, callback) ->
    $.postWithPrefix "#{url}/input_ajax", data, callback
