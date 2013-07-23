class @Sequence
  constructor: (element) ->
    @el = $(element).find('.sequence')
    @contents = @$('.seq_contents')
    @num_contents = @contents.length
    @id = @el.data('id')
    @modx_url = @el.data('course_modx_root')
    @parse_progress()
    @initProgress()
    @bind()
    @render parseInt(@el.data('position'))

  $: (selector) ->
    $(selector, @el)

  bind: ->
    @$('#sequence-list a').click @goto

  #Example 0/1 1/2 5/7 percenta = (0+1+5)/(1+2+7) = 0.6

  parse_progress: ->
    earned = 0
    possible = 0
    $('.problems-wrapper').each (index) ->
      progress = $(this).attr 'progress'
      earned += parseInt(progress.substring(0,progress.indexOf('/')))
      possible += parseInt(progress.substring(progress.indexOf('/')+1))
    percenta = 1
    if possible != 0
      percenta = earned/possible
    return percenta


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
    percenta = @parse_progress()
    progress = "in_progress"
    if percenta == 0
      progress = "none"
    if percenta == 1
      progress = "done"
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

      @mark_active new_position
      @$('#seq_content').html @contents.eq(new_position - 1).text()
      XModule.loadModules(@$('#seq_content'))

      MathJax.Hub.Queue(["Typeset", MathJax.Hub, "seq_content"]) # NOTE: Actually redundant. Some other MathJax call also being performed
      window.update_schematics() # For embedded circuit simulator exercises in 6.002x

      @position = new_position
      @toggleArrows()
      @hookUpProgressEvent()

      sequence_links = @$('#seq_content a.seqnav')
      sequence_links.click @goto

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

  next: (event) =>
    event.preventDefault()
    new_position = @position + 1
    Logger.log "seq_next", old: @position, new: new_position, id: @id

    analytics.pageview @id

    # navigation using the next arrow
    analytics.track "Accessed Next Sequential",
      sequence_id: @id
      current_sequential: @position
      target_sequential: new_position

    @render new_position

  previous: (event) =>
    event.preventDefault()
    new_position = @position - 1
    Logger.log "seq_prev", old: @position, new: new_position, id: @id

    analytics.pageview @id

    # navigation using the previous arrow
    analytics.track "Accessed Previous Sequential",
      sequence_id: @id
      current_sequential: @position
      target_sequential: new_position

    @render new_position


  godynamo: (event) =>
    event.preventDefault()
    @term = @contents.eq(@position - 1).data('direct_term')
    percenta = @parse_progress()
    good = parseInt(@term.substring(0,@term.indexOf(',')))
    bad = parseInt(@term.substring(@term.indexOf(',')+1))
    if percenta > 0.5
      new_position = good
    else
      new_position = bad
    Logger.log "seq_godynamo", old: @position, new: new_position, id: @id

    analytics.pageview @id

    # navigation using the previous arrow
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