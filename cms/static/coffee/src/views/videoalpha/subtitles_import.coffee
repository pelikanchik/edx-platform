class CMS.Views.SubtitlesImport extends Backbone.View
  tagName: 'div'
  className: 'comp-subtitles-entry'

  events:
    # "click .message-actions .import-cancel-button": 'clickNoButton'
    # "click .message-actions .import-ok-button": 'clickOkButton'
    # "click .message-actions .import-abort-button": 'clickAbortButton'
    # "click .message-warn .message-actions .import-true-button": 'clickYesButton'
    "click #import-from-youtube": 'clickImportFromYoutube'

  initialize: ->
    _.bindAll(@)

    @id = @$el.closest('.component').data('id')
    @component = @$el.closest('.component-editor')
    @componentBtns = @component.find('> .module-actions')
    @onDelete = @options.onDelete
    @showImportVariants()

  render: (type, params = {}) ->
    @$el.html(@options.tpl[type](params))

  showWarnMessage: ->

    that = @

    @msg = new CMS.Models.WarningMessage(
        title: ""
        message: "<p>If subtitles for the video already exist,
        importing again will overwrite them.</p>
        <p>Are you sure that you want to import the subtitle file
        found on YouTube?</p>"
        actions:
          primary:
            text: gettext("Yes")
            click: (view) ->
              view.hide()
              that.importFromYoutube()
          secondary: [
            text: gettext("No")
            click: (view) ->
              view.hide()
          ]
    )
    @view = new CMS.Views.Prompt({model: @msg})

  showWaitMessage: ->
    @msg = new CMS.Models.WarningMessage(
        title: gettext("Please wait for the subtitles to download")
    )
    @view = new CMS.Views.Prompt({model: @msg})

  showSuccessMessage: ->
    @msg = new CMS.Models.ConfirmationMessage(
        title: gettext("Success")
        message: "Subtitles were successfully imported."
        actions:
          primary:
            text: gettext("Ok")
            click: (view) ->
              view.hide()
    )
    @view = new CMS.Views.Prompt({model: @msg})

  showErrorMessage: ->
    that = @

    @msg = new CMS.Models.ErrorMessage(
        title: gettext("Error")
        message: "Import failed!"
        actions:
          primary:
            text: gettext("Ok")
            click: (view) ->
              view.hide()
              that = null
    )
    @view = new CMS.Views.Prompt({model: @msg})

  showImportVariants: ->
    @render('variants')

  clickImportFromYoutube: (event) ->
    event.preventDefault()
    @showWarnMessage()

  importFromYoutube: ->
    that = @
    @showWaitMessage()

    @xhr = $.ajax(
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