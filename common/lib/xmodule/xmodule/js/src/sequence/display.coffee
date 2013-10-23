class @Sequence
  total_seconds = 0
  constructor: (element) ->
    @el = $(element).find('.sequence')
    @contents = @$('.seq_contents')
    @num_contents = @contents.length
    @id = @el.data('id')
    @modx_url = @el.data('course_modx_root')
    @next_attempt_set = @el.data('next_attempt_set')
    @initProgress()
    @bind()
    total_seconds = 0
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
        $("#seq_position")[0].setAttribute "position", new_position
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
      @timeout = parseInt(($('.temp-data')[@position - 1]).getAttribute("timeout"))
      if @timeout == 0
        $('.attempt-message').css("display","none")
        $('.dialog-finish-test').css("display","none")
      else
        $('.attempt-message').css("display","block")
        $('.dialog-finish-test').css("display","block")
        if @time_check() == true
          total_seconds = 0
        else
          total_seconds = 28211488
        @update_check_buttons()
        @update_sequence_buttons()

  time_check: =>
    time_now = new Date()
    array_now = []
    array_next_attempt = []
    array_next_attempt_str = ($('.temp-data')[@position - 1]).getAttribute("next_attempt").split(":")
    i = 0
    for elem in array_next_attempt_str
      array_next_attempt[i] = parseInt(elem)
      i++
    array_now[0] = parseInt(time_now.getFullYear())
    array_now[1] = parseInt(time_now.getMonth()) + 1
    array_now[2] = parseInt(time_now.getDate())
    array_now[3] = parseInt(time_now.getHours())
    array_now[4] = parseInt(time_now.getMinutes())
    array_now[5] = parseInt(time_now.getSeconds())
    i = 0
    while i < 6
      if array_now[i] < array_next_attempt[i]
        return false
      if array_now[i] > array_next_attempt[i]
        return true
      if array_now[i] == array_next_attempt[i]
        i++
    return true

  finish_test: =>
    modx_full_url = @modx_url + "/" + @id + "/change_attempt_time"
    _this = this
    $(".finish-test").attr "disabled", true
    $(".dialog-finish-test").attr "disabled", true
    _position = $("#seq_position")[0].getAttribute("position")
    _availability = ($('.temp-data')[_position - 1]).getAttribute("availability")
    _availability_array = JSON.parse(_availability.split("'").join("\""))
    for el in _availability_array
      string_id = "problem_" + el["id"].split("://").join("-").split("/").join("-")
      el.test_status = "unavailable"
      status = el.test_status
      @update_one_check_button string_id, status
    _av_string = JSON.stringify(_availability_array)
    _av_string_corr = _av_string.split("\"").join("'")
    ($('.temp-data')[_position - 1]).setAttribute "availability", _av_string_corr
    $.postWithPrefix modx_full_url, (response) ->
      _time_next_attempt = response.next_attempt
      ($('.temp-data')[_position - 1]).setAttribute "next_attempt", _time_next_attempt
      if _this.time_check() == true
        total_seconds = 0
      else
        total_seconds = 28211488
      _this.update_sequence_buttons()


  update_sequence_buttons: =>
    _position = $("#seq_position")[0].getAttribute("position")
    if total_seconds < 1
      $(".finish-test").removeAttr "disabled"
      $(".dialog-finish-test").removeAttr "disabled"
      _availability = ($('.temp-data')[_position - 1]).getAttribute("availability").split("'").join('"')
      _availability_array = JSON.parse(_availability)
      for  el in _availability_array
        if el["test_status"] is "unavailable"
          el["test_status"] = "unanswered"
          string_id = "problem_" + el["id"].split("://").join("-").split("/").join("-")
          status = el["test_status"]
          @update_one_check_button string_id, status
      _av_string = JSON.stringify(_availability_array)
      _av_string_corr = _av_string.split("\"").join("'")
      ($('.temp-data')[_position - 1]).setAttribute "availability", _av_string_corr
      _total_seconds = @timeout
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
      array_next_attempt_str = ($('.temp-data')[_position - 1]).getAttribute("next_attempt").split(":")
      i=0
      for elem in array_next_attempt_str
        array_next_attempt[i] = parseInt(elem)
        if elem.length == 1
          elem = "0" + elem
        i++
      array_now[0] = parseInt(time_now.getFullYear())
      array_now[1] = parseInt(time_now.getMonth()) + 1
      array_now[2] = parseInt(time_now.getDate())
      array_now[3] = parseInt(time_now.getHours())
      array_now[4] = parseInt(time_now.getMinutes())
      array_now[5] = parseInt(time_now.getSeconds())
      i = 0
      while i < 6
        if array_now[i] > array_next_attempt[i]
          total_seconds = 0
          @update_sequence_buttons()
        if array_now[i] < array_next_attempt[i]
          i = 6
          break
        i++
      _total_seconds = array_next_attempt[5] - array_now[5] + (array_next_attempt[4] - array_now[4]) * 60 + (array_next_attempt[3] - array_now[3]) * 60 * 60 + (array_next_attempt[2] - array_now[2]) * 60 * 60 * 24
      if _total_seconds < 0
        total_seconds = 1200
        @$(".attempt-message").html "Вы сможете снова ответить на вопросы не ранее, чем в " + array_next_attempt_str[3] + ":" + array_next_attempt_str[4] + ":" + array_next_attempt_str[5] + " " + array_next_attempt_str[2] + "." + array_next_attempt_str[1] + "." + array_next_attempt_str[0]
      else if _total_seconds > 1200
        total_seconds = 1200
        @$(".attempt-message").html "Вы сможете снова ответить на вопросы не ранее, чем в " + array_next_attempt_str[3] + ":" + array_next_attempt_str[4] + ":" + array_next_attempt_str[5] + " " + array_next_attempt_str[2] + "." + array_next_attempt_str[1] + "." + array_next_attempt_str[0]
      else
        total_seconds = _total_seconds
        _seconds = _total_seconds % 60
        _minutes = (_total_seconds - _seconds) / 60
        _seconds_str = _seconds + ""
        _seconds_str = "0" + _seconds_str  if _seconds < 10
        @$(".attempt-message").html "Вы сможете снова ответить на вопросы не ранее, чем в " + array_next_attempt[3] + ":" + array_next_attempt[4] + ":" + array_next_attempt[5] + " " + array_next_attempt[2] + "." + array_next_attempt[1] + "." + array_next_attempt[0] + ". \n\n Осталось " + _minutes + ":" + _seconds_str
        setTimeout @update_sequence_buttons, 1000

  update_check_buttons: =>
    _position = $("#seq_position")[0].getAttribute("position")
    _availability = ($('.temp-data')[_position - 1]).getAttribute("availability").split("'").join('"')
    _availability_array = JSON.parse(_availability)
    for el in _availability_array
      string_id = "problem_" + el["id"].split("://").join("-").split("/").join("-")
      status = el["test_status"]
      @update_one_check_button(string_id, status)

  update_one_check_button: (string_id, status) =>
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
      setTimeout @update_one_check_button, 1000, string_id, status


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
