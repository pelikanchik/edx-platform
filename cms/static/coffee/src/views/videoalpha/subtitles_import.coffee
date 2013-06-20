class CMS.Views.SubtitlesImport extends Backbone.View
  tagName: 'div'
  className: 'comp-subtitles-entry'

  events:
    "click #import-from-youtube": 'clickImportFromYoutube'

  initialize: ->
    _.bindAll(@)
    @prompt = null
    @id = @$el.closest('.component').data('id')
    @models =
      success: new CMS.Models.ConfirmationMessage(
        title: gettext("Subtitles were successfully imported.")
        actions:
          primary:
            text: gettext("Ok")
            click: (view, e) ->
              view.hide()
              e.preventDefault()
      )
      warn: new CMS.Models.WarningMessage(
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
      )
      wait: new CMS.Models.WarningMessage(
        title: gettext("Please wait for the subtitles to download")
        message: '''
          <div id="circle-preloader">
            <div id="circle-preloader_1" class="circle-preloader"></div>
            <div id="circle-preloader_2" class="circle-preloader"></div>
            <div id="circle-preloader_3" class="circle-preloader"></div>
          </div>
        '''
      )
      error: new CMS.Models.ErrorMessage(
        title: gettext("Import failed!")
        actions:
          primary:
            text: gettext("Ok")
            click: (view, e) ->
              view.hide()
              e.preventDefault()
      )

    @showImportVariants()

  render: (type, params = {}) ->
    @$el.html(@options.tpl[type](params))

  showPrompt: (model) ->
    if @prompt
      @prompt.model = model
      @prompt.show()
    else
      @prompt = new CMS.Views.Prompt({model: model})

  showWarnMessage: ->
    model =  @models.warn
    @showPrompt(model)

  showWaitMessage: ->
    model = @models.wait
    @showPrompt(model)

  showSuccessMessage: ->
    model = @models.success
    @showPrompt(model)

  showErrorMessage: (title, message)->
    model = @models.error
    model.set('title', title) if title
    model.set('message', message) if message
    @showPrompt(model)

  showImportVariants: ->
    @render('variants')

  clickImportFromYoutube: (event) ->
    event.preventDefault()
    @showWarnMessage()

  importFromYoutubeHandler: (view, event)->
      view.hide()
      @importFromYoutube()
      event.preventDefault()

  importFromYoutube: ->
    that = @
    @showWaitMessage()
    $.ajax(
          url: "/import_subtitles"
          type: "POST"
          dataType: "json"
          contentType: "application/json"
          data: JSON.stringify(
              'id': @id
          )
      )
      .success((data) ->
        if data.status is 'success'
          that.showSuccessMessage()
        else
          that.showErrorMessage()
      )
      .error((data) ->
        that.showErrorMessage()
      )