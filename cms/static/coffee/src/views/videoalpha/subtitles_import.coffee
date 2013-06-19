class CMS.Views.SubtitlesImport extends Backbone.View
  tagName: 'div'
  className: 'comp-subtitles-entry'

  events:
    "click .message-actions .import-cancel-button": 'clickNoButton'
    "click .message-actions .import-ok-button": 'clickOkButton'
    "click .message-actions .import-abort-button": 'clickAbortButton'
    "click .message-warn .message-actions .import-true-button": 'clickYesButton'
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
    @render('warn')

  showWaitMessage: ->
    @render('wait')

  showSuccessMessage: ->
    @render('success')

  showErrorMessage: ->
    @render('error')

  showImportVariants: ->
    @render('variants')

  clickYesButton: (event) =>
    event.preventDefault()
    @showWaitMessage()
    @importFromYoutube()

  clickNoButton: (event) ->
    event.preventDefault()
    @showImportVariants()
    @componentBtns.show()

  clickAbortButton: (event) ->
    event.preventDefault()
    @xhr.abort() if @xhr
    @showImportVariants()
    @componentBtns.show()

  clickOkButton: (event) ->
    event.preventDefault()
    @showImportVariants()
    @componentBtns.show()

  clickImportFromYoutube: (event) ->
    event.preventDefault()
    @showWarnMessage()
    @componentBtns.hide()

  importFromYoutube: ->
    error = @showErrorMessage
    success = @showSuccessMessage
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
          success()
        else
          error()
      )
      .error((data) ->
        error()
      )