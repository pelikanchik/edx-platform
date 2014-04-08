define ["backbone", "jquery", "underscore", "gettext", "xblock/runtime.v1",
        "js/views/feedback_notification", "js/views/metadata", "js/collections/metadata"
        "js/utils/modal", "jquery.inputnumber", "xmodule", "coffee/src/main"],
(Backbone, $, _, gettext, XBlock, NotificationView, MetadataView, MetadataCollection, ModalUtils) ->
  class ModuleEdit extends Backbone.View
    tagName: 'li'
    className: 'component'
    editorMode: 'editor-mode'

    events:
      "click .component-editor .cancel-button": 'clickCancelButton'
      "click .component-editor .save-button": 'clickSaveButton'
      "click .component-actions .edit-button": 'clickEditButton'
      "click .component-actions .insert-button": 'clickInsertButton'
      "click .component-actions .insert-to-end-button": 'clickInsertToEndButton'
      "click .component-actions .snapshot": 'clickSnapshot'
      "click .component-actions .delete-button": 'onDelete'
      "click .mode a": 'clickModeButton'
      "click .save-view-button": 'clickSaveViewButton'
      "click .edit-view-button":'editViewButton'
      "click .back-from-edit-view-button":'backFromEditViewButton'

    initialize: ->
      @onDelete = @options.onDelete
      @createItemStatus = 0
      @render()

    $component_editor: => @$el.find('.component-editor')

    loadDisplay: ->
      XBlock.initializeBlock(@$el.find('.xblock-student_view'))

    loadEdit: ->
      if not @module
        @module = XBlock.initializeBlock(@$el.find('.xblock-studio_view'))
        # At this point, metadata-edit.html will be loaded, and the metadata (as JSON) is available.
        metadataEditor = @$el.find('.metadata_edit')
        metadataData = metadataEditor.data('metadata')
        models = [];
        for key of metadataData
          models.push(metadataData[key])
        @metadataEditor = new MetadataView.Editor({
            el: metadataEditor,
            collection: new MetadataCollection(models)
        })

        @module.setMetadataEditor(@metadataEditor) if @module.setMetadataEditor

        # Need to update set "active" class on data editor if there is one.
        # If we are only showing settings, hide the data editor controls and update settings accordingly.
        if @hasDataEditor()
          @selectMode(@editorMode)
        else
          @hideDataEditor()

        title = interpolate(gettext('<em>Editing:</em> %s'),
          [@metadataEditor.getDisplayName()])
        @$el.find('.component-name').html(title)

    customMetadata: ->
        # Hack to support metadata fields that aren't part of the metadata editor (ie, LaTeX high level source).
        # Walk through the set of elements which have the 'data-metadata_name' attribute and
        # build up an object to pass back to the server on the subsequent POST.
        # Note that these values will always be sent back on POST, even if they did not actually change.
        _metadata = {}
        _metadata[$(el).data("metadata-name")] = el.value for el in $('[data-metadata-name]', @$component_editor())
        return _metadata

    changedMetadata: ->
      return _.extend(@metadataEditor.getModifiedMetadataValues(), @customMetadata())

    createItem: (parent, payload, callback=->) ->
      payload.parent_locator = parent
      @createItemStatus = 1
      $.postJSON(
          @model.urlRoot
          payload
          (data) =>
              @model.set(id: data.locator)
              @$el.data('locator', data.locator)
              @render()
      ).success(callback)

    render: ->
      if @model.id
        @$el.load(@model.url(), =>
          @loadDisplay()
          @delegateEvents()
          if @createItemStatus == 1
            @createItemStatus = 0
            @$el.addClass('editing')
            ModalUtils.showModalCover(true)
            @$component_editor().slideDown(150)
            retValue = @loadEdit()
            modifiedMetadataValues = @metadataEditor.getModifiedMetadataValues()
            if 'display_name' of modifiedMetadataValues
              data = {'metadata': {'display_name': modifiedMetadataValues['display_name']}}
              @model.save(data).done( =>
                if @model.id.indexOf('video') isnt -1 and @model.attributes.metadata.display_name 
                  h2 = $(@$el).find('h2')[0]
                  $(h2).text(@model.attributes.metadata.display_name )
                else
                  @loadDisplay()
              )
            return retValue
        )


    backFromEditViewButton: (event) =>
      event.preventDefault()
      unique_id = $(@$el).find(".problems-wrapper").attr("id")
      $("#yandex-player-" + unique_id).remove()

      $(@$el).find(".problems-wrapper").removeClass("preview");
      $(@$el).find(".draggable-field").draggable("disable")
      $(@$el).find(".draggable-field").removeClass("draggable-field").removeClass("ui-draggable-disabled").removeClass("ui-state-disabled");
      $(@$el).find(".resizable-field").removeClass("resizable-field").removeClass("ui-resizable-disabled").removeClass("ui-state-disabled");


      $(@$el).find(".back-from-edit-view-button, .save-view-button, .scrollbar").css "display", "none"
      $(@$el).find(".edit-view-button, .check, .show, .reset, .clear, .save").css "display", "inline"

    editViewButton: (event) =>
      event.preventDefault()

      @loadEdit()
      unique_id = $(@$el).find(".problems-wrapper").attr("id")

      $(@$el).find(".capa_inputtype, .inputtype").addClass "draggable-field"
      $(@$el).find(".capa_inputtype, .inputtype").addClass "resizable-field"
      $(@$el).find(".problems-wrapper").addClass "preview"


      updateStyles = (element) ->
        styleset = ""
        styleset += "#" + element.find(".problems-wrapper").attr("id") + "{overflow-x:hidden;background-color:" + element.find(".problems-wrapper").css("background-color") + "}"
        element.find(".capa_inputtype, .inputtype").each ->
          styleset += "#" + $(this).attr("id") + "{position:relative; left:" + $(this).css("left") + "; top: " + $(this).css("top") + "}"

        element.find("[data-field_name='additional_css']").next().val styleset

      updateCssStyle = (id, style) ->
        $("#" + id).data "styles", "#" + id + "{" + style + "}"
        updateStyles $("#" + id).parents(".component")

      updateBGOpacity = (id, opacity) ->
        styles = " rgba(255,255,255," + opacity + ")"
        $("#" + id).css "background-color", styles
        $("#" + id).data "styles", "#" + id + "{background-color:" + styles + "}"
        updateStyles $("#" + id).parents(".component")

      opacityStr = $(@$el).find(".problems-wrapper").css("background-color").split(",")[3]
      if opacityStr
        opacityInt = parseInt(parseFloat(opacityStr) * 100)
      else
        opacityInt = 100
      $(@$el).find(".scrollbar").slider
        max: 100
        value: 100 - opacityInt
        min: 0
        slide: (event, ui) ->
          updateBGOpacity $(this).parents(".problems-wrapper").attr("id"), 1 - ui.value / 100

      $(@$el).find(".resizable-field").resizable
      $(@$el).find(".draggable-field").draggable drag: ->
        updateCssStyle $(this).attr("id"), $(this).attr("style")

      $(@$el).find(".draggable-field").draggable("enable")
      $(@$el).find(".edit-view-button, .check, .show, .reset, .clear, .save").css "display", "none"
      $(@$el).find(".back-from-edit-view-button, .save-view-button").css "display", "inline"

      if $(@$el).find(".problems-wrapper").hasClass("backshot")
        $(@$el).children(".xblock").prepend $("#yandex-player").clone(true, true).attr("id", "yandex-player-" + unique_id)
        problem_time = $(@$el).find(".problems-wrapper .problem").data("problem_time")
        $(@$el).find(".scrollbar").css "display", "inline-block"
        setTimeout (->
          document["yandex-player-" + unique_id].playVideo()
          document["yandex-player-" + unique_id].seekTo problem_time
          document["yandex-player-" + unique_id].pauseVideo()
          return
        ), 1000

    clickSaveButton: (event) =>
      event.preventDefault()
      data = @module.save()

      analytics.track "Saved Module",
        course: course_location_analytics
        id: _this.model.id

      data.metadata = _.extend(data.metadata || {}, @changedMetadata())
      ModalUtils.hideModalCover()
      saving = new NotificationView.Mini
        title: gettext('Saving&hellip;')
      saving.show()
      @model.save(data).done( =>
        @module = null
        @render()
        @$el.removeClass('editing')
        saving.hide()
      )

    clickCancelButton: (event) ->
      event.preventDefault()
      @$el.removeClass('editing')
      @$component_editor().slideUp(150)
      ModalUtils.hideModalCover()

    clickSaveViewButton: (event) ->
      event.preventDefault()
      data = @module.save()
      _this = this
      additional_styles = $(@$el).find("[data-field_name='additional_css']").next().val()
      data.metadata = _.extend(data.metadata or {},
        additional_css: additional_styles
      )
      @model.save(data).done ->
        _this.module = null
        _this.render()

    clickEditButton: (event) ->
      event.preventDefault()
      @$el.addClass('editing')
      ModalUtils.showModalCover(true)
      @$component_editor().slideDown(150)
      @loadEdit()

    clickModeButton: (event) ->
      event.preventDefault()
      if not @hasDataEditor()
        return
      @selectMode(event.currentTarget.parentElement.id)

    hasDataEditor: =>
      return @$el.find('.wrapper-comp-editor').length > 0

    selectMode: (mode) =>
      dataEditor = @$el.find('.wrapper-comp-editor')
      settingsEditor = @$el.find('.wrapper-comp-settings')
      editorModeButton = @$el.find('#editor-mode').find("a")
      settingsModeButton = @$el.find('#settings-mode').find("a")

      if mode == @editorMode
        # Because of CodeMirror editor, cannot hide the data editor when it is first loaded. Therefore
        # we have to use a class of is-inactive instead of is-active.
        dataEditor.removeClass('is-inactive')
        editorModeButton.addClass('is-set')
        settingsEditor.removeClass('is-active')
        settingsModeButton.removeClass('is-set')
      else
        dataEditor.addClass('is-inactive')
        editorModeButton.removeClass('is-set')
        settingsEditor.addClass('is-active')
        settingsModeButton.addClass('is-set')

    hideDataEditor: =>
      editorModeButtonParent = @$el.find('#editor-mode')
      editorModeButtonParent.addClass('inactive-mode')
      editorModeButtonParent.removeClass('active-mode')
      @$el.find('.wrapper-comp-settings').addClass('is-active')
      @$el.find('#settings-mode').find("a").addClass('is-set')


    clickInsertButton: (event) ->
      event.preventDefault()

      if !@$el.find('.vidtime').html()
        #yandex
        current_time = GetPlayer().getCurrentTime();
        duration_time = GetPlayer().getMovieInfo().duration;
        if current_time > 0
          if current_time == duration_time
            current_time -= 1
      else
        #youtube
        vidtime = @$el.find('.vidtime')
        time_str = vidtime.html()
        cur_time_str = time_str.substr(0,time_str.indexOf('/')-1)
        duration_time_str = time_str.substr(time_str.indexOf('/')+2)
        cur_time_str_parts = cur_time_str.split(':')
        current_time = 0
        for elem in cur_time_str_parts
          time_part = parseInt(elem)
          current_time = current_time*60+time_part
        if current_time > 0
          if cur_time_str == duration_time_str
            current_time = current_time - 1

      if current_time == 0
         current_time = 1
      seconds = current_time%60
      minutes = ((current_time-seconds)/60)%60
      hours = (current_time-minutes*60-seconds)/3600
      seconds_str = seconds + ""
      if seconds_str.length == 1
        seconds_str = "0" + seconds_str
      minutes_str = minutes + ""
      if minutes_str.length == 1
        minutes_str = "0" + minutes_str
      hours_str = hours + ""
      if hours_str.length == 1
        hours_str = "0" + hours_str
      time_format = hours_str + ":" + minutes_str + ":" + seconds_str
      $(".video_control").click()
      new_component = document.getElementsByClassName('multiple-templates')
      for elem in new_component
        if elem.getAttribute('data-type') == 'problem'
          elem.click()
          elem.setAttribute 'time', time_format
          elem.setAttribute 'show_now', 'False'

    clickInsertToEndButton: (event) ->
      event.preventDefault()
      if !@$el.find('.vidtime').html()
        #yandex
        current_time = GetPlayer().getCurrentTime();
        duration_time = GetPlayer().getMovieInfo().duration;
      else
        #youtube
        vidtime = @$el.find('.vidtime').html()
        duration_time_str = vidtime.substr(vidtime.indexOf('/')+2)
        duration_time_str = duration_time_str.split(':')
        duration_time = 0
        for elem in duration_time_str
          time_part = parseInt(elem)
          duration_time = duration_time * 60 + time_part

      if duration_time == 0
        alert "Video wasn't loaded yet. Please, press Play button"
      else
        duration_time -= 1
        seconds = duration_time%60
        minutes = ((duration_time-seconds)/60)%60
        hours = (duration_time-minutes*60-seconds)/3600
        seconds_str = parseInt(seconds) + ""
        if seconds_str.length  == 1 || seconds < 10
          seconds_str = "0" + seconds_str
        minutes_str = minutes + ""
        if minutes_str.length == 1
          minutes_str = "0" + minutes_str
        hours_str = hours + ""
        if hours_str.length == 1
          hours_str = "0" + hours_str
        time_format = hours_str + ":" + minutes_str + ":" + seconds_str
        new_component = document.getElementsByClassName('multiple-templates')
        for elem in new_component
          if elem.getAttribute('data-type') == 'problem'
          #if elem.data.type == 'problem'
            elem.click()
            elem.setAttribute 'time', time_format
            elem.setAttribute 'show_now', 'False'

    clickSnapshot: (event) ->
      event.preventDefault()
      alert "Hello!"
