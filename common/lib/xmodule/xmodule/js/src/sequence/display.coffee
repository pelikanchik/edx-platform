class @Sequence
  constructor: (element) ->
    @el = $(element).find('.sequence')
    @contents = @$('.seq_contents')
    @num_contents = @contents.length
    @id = @el.data('id')
    @ajaxUrl = @el.data('ajax-url')
    @initProgress()
    @bind()

    has_dynamic_graph = $('#has_dynamic_graph').val() == "True"
    staff_access = $('#staff_access').val()  == "True"
    masquerade = $('#masquerade').val() == "student"
    # If this is a course with dynamic graph and the user is a student
    if has_dynamic_graph and (not staff_access or masquerade)
      @dynamic_sequence_list = true
      # If load page from link
      if @el.data('fromLink') == "True"
        position = parseInt(@el.data('position')) 
        history_position = parseInt($('#history_length').val())
        tmp = parseInt(@$('#sequence-list a').last().data('element'))
        # If a new position isnt the same as the last position in the history
        if position !=  parseInt(@$('#sequence-list a').last().data('element'))
          history_position = history_position + 1
          subsection_id = @id.substr(@id.indexOf('sequential/') + 'sequential/'.length)
          update_history_url = @ajaxUrl.substr(0, @ajaxUrl.indexOf('/xblock')) + '/update_history/' + subsection_id + '/' + parseInt($('#history_length').val()) + '/' + position
          $.postWithPrefix update_history_url, (responce) =>

        modx_full_url = @ajaxUrl + '/goto_position'
        $.postWithPrefix modx_full_url, history_position: history_position
      else
        history_position = parseInt(@el.data('historyPosition'))
        position = parseInt($("#sequence-list a[data-history-position=#{history_position}]", @el).data('element'))
      @render position, history_position
    else
      @dynamic_sequence_list = false
      @render parseInt(@el.data('position'))      

  $: (selector) ->
    $(selector, @el)

  bind: ->
    @$('#sequence-list a').click @goto
    $('#hidden_seq_buttons a').click @goto


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
    @$('.sequence-nav-buttons').find('a, input').unbind('click')
    @$('#seq_content').unbind('godynamo')
    @$('.sequence-nav-buttons .godynamo a').removeClass('disabled').click(@godynamo)
    @$('.sequence-nav-buttons').find('.gobackdynamo a, input.gobackdynamo').removeClass('disabled').click(@gobackdynamo)
    @$('.sequence-nav-buttons input.resethistory').click(@reset_history)
    @$('#seq_content').bind('godynamo', @godynamo)

    if @contents.length == 0
      @$('.sequence-nav-buttons .godynamo a').addClass('disabled')
      @$('.sequence-nav-buttons .gobackdynamo a').addClass('disabled')
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

    if @history_position? and @history_position == 1
      @$('.sequence-nav-buttons .gobackdynamo a').addClass('disabled')

  render: (new_position, new_history_position) ->
    if @position != new_position or (new_history_position? and @history_position != new_history_position)
      if @position != undefined
        modx_full_url = @ajaxUrl + '/goto_position'
        post_data = {position: new_position}
        if new_history_position?
          @mark_visited @history_position, true
          post_data['history_position'] = new_history_position
        else
          @mark_visited @position
        
        $.postWithPrefix modx_full_url, post_data

      # On Sequence change, fire custom event "sequence:change" on element.
      # Added for aborting video bufferization, see ../video/10_main.js
      @el.trigger "sequence:change"
      # Checks whether sequence-list should be created according to the progress history of the user
      if @dynamic_sequence_list and new_history_position?
        seq_length = $('#sequence-list').children().length

        if new_history_position == 1
          $(".sequence-bottom .sequence-nav-buttons").children().remove()
        else if not $(".sequence-bottom .sequence-nav-buttons").children().length
          $(".sequence-bottom .sequence-nav-buttons").append(
              "<input class='gobackdynamo' type='button' value='" + gettext("Back") + "' style='font-weight: normal' />
               <input class='resethistory' type='button' value='" + gettext("Start over") + "' style='font-weight: normal' />"
          )

        if new_history_position > seq_length
          new_seq_button = $('<li></li>').append($("#hidden_seq_buttons a[data-element=#{new_position}]").clone(true))
          new_seq_button.children().attr("data-history-position", new_history_position)
          @$('#sequence-list').append(new_seq_button)
        else
          seq_button = @$("#sequence-list a[data-history-position=#{new_history_position}]")
          if parseInt(seq_button.attr('data-element')) != new_position
            seq_button.parent().prev().nextAll().remove() # Remove all buttons after the current, including the current
            new_seq_button = $('<li></li>').append($("#hidden_seq_buttons a[data-element=#{new_position}]").clone(true))
            new_seq_button.children().attr("data-history-position", new_history_position)
            @$('#sequence-list').append(new_seq_button)

        @mark_active new_history_position, true
      else
        @mark_active new_position

      @$('#seq_content').html @contents.eq(new_position - 1).text()
      XBlock.initializeBlocks(@$('#seq_content'))

      MathJax.Hub.Queue(["Typeset", MathJax.Hub, "seq_content"]) # NOTE: Actually redundant. Some other MathJax call also being performed
      window.update_schematics() # For embedded circuit simulator exercises in 6.002x

      @position = new_position

      if new_history_position?
        @history_position = new_history_position

      @toggleArrows()
      @hookUpProgressEvent()

      sequence_links = @$('#seq_content a.seqnav')
      sequence_links.click @goto
    @$("a.active").blur()

  goto: (event) =>
    event.preventDefault()
    if $(event.target).hasClass 'seqnav' # Links from courseware <a class='seqnav' href='n'>...</a>
      new_position = $(event.target).attr('href')
    else # Tab links generated by backend template
      new_position = $(event.target).data('element')

    if $(event.target).attr('data-history-position')
      new_history_position = $(event.target).data('historyPosition')

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

      if @dynamic_sequence_list and new_history_position?
        @render new_position, new_history_position
      else
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
    modx_full_url = @ajaxUrl + '/dynamo'
    $.postWithPrefix modx_full_url, (response) =>
      new_position = response.position

      if new_position != @position
        Logger.log "seq_godynamo", old: @position, new: new_position, id: @id

        analytics.pageview @id

        analytics.track "Accessed Next Sequential of the Graph",
          sequence_id: @id
          current_sequential: @position
          target_sequential: new_position
          current_history_position: @history_position
          target_history_position: @history_position + 1

        if @dynamic_sequence_list and @history_position?
          subsection_id = @id.substr(@id.indexOf('sequential/') + 'sequential/'.length)
          update_history_url = @ajaxUrl.substr(0, @ajaxUrl.indexOf('/xblock')) + '/update_history/' + subsection_id + '/' + @history_position + '/' + new_position
          $.postWithPrefix update_history_url, (responce) =>
          @render new_position, @history_position + 1
        else
          @render new_position

  gobackdynamo: (event) =>
    event.preventDefault()
    @$('.sequence-nav-buttons .gobackdynamo a').addClass('disabled')
    subsection_id = @id.substr(@id.indexOf('sequential/') + 'sequential/'.length)
    modx_full_url = @ajaxUrl.substr(0, @ajaxUrl.indexOf('/xblock')) + '/gobackdynamo/' + subsection_id + '/' + @history_position
    $.postWithPrefix modx_full_url, (response) =>

      if not jQuery.isEmptyObject(response)
        new_position = response.position
        Logger.log "seq_gobackdynamo", old: @position, new: new_position, id: @id

        analytics.pageview @id

        analytics.track "Accessed Previous Sequential of the Graph",
          sequence_id: @id
          current_sequential: @position
          target_sequential: new_position
          current_history_position: @history_position
          target_history_position: @history_position - 1

        if @dynamic_sequence_list and @history_position?
          @render new_position, @history_position - 1
        else
          @render new_position

  reset_history: (event) =>
    event.preventDefault()
    subsection_id = @id.substr(@id.indexOf('sequential/') + 'sequential/'.length)
    modx_full_url = @ajaxUrl.substr(0, @ajaxUrl.indexOf('/xblock')) + '/reset_history/' + subsection_id
    $.postWithPrefix modx_full_url, (response) =>
      @$("#sequence-list").children().first().nextAll().remove()

      Logger.log "seq_reset_history", old: @position, new: 1, id: @id

      analytics.pageview @id

      analytics.track "Reset Progress History",
        sequence_id: @id
        current_sequential: @position
        target_sequential: 1
        current_history_position: @history_position
        target_history_position: 1

      @render 1, 1

  # if the second argument is given and true, the function will use position in the progress history
  link_for: (position, history=false) ->
    if history
      @$("#sequence-list a[data-history-position=#{position}]")
    else
      @$("#sequence-list a[data-element=#{position}]")

  # if the second argument is given and true, the function will use position in the progress history
  mark_visited: (position, history) ->
    # Don't overwrite class attribute to avoid changing Progress class
    element = @link_for(position, history)
    element.removeClass("inactive")
    .removeClass("active")
    .addClass("visited")

  # if the second argument is given and true, the function will use position in the progress history
  mark_active: (position, history) ->
    # Don't overwrite class attribute to avoid changing Progress class
    element = @link_for(position, history)
    element.removeClass("inactive")
    .removeClass("visited")
    .addClass("active")

  @inputAjax: (url, data, callback) ->
    $.postWithPrefix "#{url}/input_ajax", data, callback
