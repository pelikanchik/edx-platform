class CMS.Views.SubtitlesImport extends Backbone.View
  tagName: 'div'
  className: 'comp-subtitles-entry'

  events:
    "click .message-actions .import-false-button": 'clickNoButton'
    "click .message-actions .import-true-button": 'clickYesButton'
    "click #import-from-youtube": 'clickImportFromYoutube'

  initialize: ->
    @id = @$el.closest('.component').data('id')
    @onDelete = @options.onDelete
    @showImportVariants()

  cloneTemplate: (parent, template) ->
    $.post("/clone_item", {
      parent_location: parent
      template: template
    }, (data) =>
      @model.set(id: data.id)
      @$el.data('id', data.id)
      @render()
    )

  render: (type, params = {}) ->
    @$el.html(@options.tpl[type](params))

  showWarnMessage: ->
    @render('warn')

  showImportVariants: ->
    @render('variants')

  clickYesButton: (event) =>
    event.preventDefault()
    @importFromYoutube()

  clickNoButton: (event) ->
    event.preventDefault()
    @showImportVariants()

  clickImportFromYoutube: (event) ->
    event.preventDefault()
    @showWarnMessage()

  importFromYoutube: ->
    $.ajax(
        url: "/save_item"
        type: "POST"
        dataType: "json"
        contentType: "application/json"
        data: JSON.stringify(
            'id': @id
        )
    ).success((data) ->
       console.log data
    )