class CMS.Views.SubtitlesImport extends Backbone.View
  tagName: 'div'
  className: 'comp-subtitles-entry'
  url: "/import_subtitles"

  events:
    "click #import-from-youtube": 'clickImportFromYoutube'

  initialize: ->
    _.bindAll(@)
    @prompt = null
    @id = @$el.closest('.component').data('id')
    @types =
      success:
        intent: 'confirmation'
        title: gettext("Subtitles were successfully imported.")
        message: null
        actions:
          primary:
            text: gettext("Ok")
            click: (view, e) ->
              view.hide()
              e.preventDefault()
          secondary: null
      warn:
        intent: 'warning'
        title: gettext("Are you sure that you want to import the subtitle file found on YouTube?")
        message: gettext("If subtitles for the video already exist, importing again will overwrite them.")
        actions:
          primary:
            text: gettext("Yes")
            click: @importFromYoutubeHandler

          secondary: [
            text: gettext("No")
            click: (view, e) ->
              view.hide()
              e.preventDefault()
          ]
      wait:
        intent: 'warning'
        title: gettext("Please wait for the subtitles to download")
        message: '''
          <div id="circle-preloader">
            <div id="circle-preloader_1" class="circle-preloader"></div>
            <div id="circle-preloader_2" class="circle-preloader"></div>
            <div id="circle-preloader_3" class="circle-preloader"></div>
          </div>
        '''
        actions: null
      error:
        intent: 'error'
        title: gettext("Import failed!")
        message: null
        actions:
          primary:
            text: gettext("Ok")
            click: (view, e) ->
              view.hide()
              e.preventDefault()
          secondary: null
    @showImportVariants()

  render: (type, params = {}) ->
    @$el.html(@options.tpl[type](params))

  showPrompt: (type, data) ->
    options = {}
    msg =  @types[type] || {}

    options = if @prompt then @prompt.options  else {}
    _.extend(options, msg, data)

    @prompt = new CMS.Views.Prompt(options) if not @prompt
    @prompt.show()

  showWarnMessage: ->
    @showPrompt('warn')

  showWaitMessage: ->
    @showPrompt('wait')

  showSuccessMessage: ->
    @showPrompt('success')

  showErrorMessage: (data)->
    type = 'error'
    options = data || {}
    @showPrompt('error', options)

  showImportVariants: ->
    @render('variants')

  clickImportFromYoutube: (event) ->
    event.preventDefault()
    @showWarnMessage()

  importFromYoutubeHandler: (view, event)->
      view.hide()
      @importFromYoutube()
      event.preventDefault()

  xhrSuccessHandler: (data) ->
    if data.status is 'success'
      @showSuccessMessage()
    else
      @showErrorMessage(data)

  xhrErrorHandler: (data) ->
    @showErrorMessage({
      title: gettext("Import failed!")
      message: gettext("Problems with connection.")
    })

  importFromYoutube: ->
    @showWaitMessage()
    $.ajax(
          url: @url
          type: "POST"
          dataType: "json"
          contentType: "application/json"
          data: JSON.stringify(
              'id': @id
          )
      )
      .success(@xhrSuccessHandler)
      .error(@xhrErrorHandler)
