AjaxPrefix.addAjaxPrefix(jQuery, -> CMS.prefix)

@CMS =
  Models: {}
  Views: {}
  Collections: {}
  URL: {}

  prefix: $("meta[name='path_prefix']").attr('content')

_.extend CMS, Backbone.Events

$ ->
  Backbone.emulateHTTP = true

  $.ajaxSetup
    headers : { 'X-CSRFToken': $.cookie 'csrftoken' }
    dataType: 'json'

  $(document).ajaxError (event, jqXHR, ajaxSettings, thrownError) ->
    if ajaxSettings.notifyOnError is false
        return
    if jqXHR.responseText
      try
        message = JSON.parse(jqXHR.responseText).error
      catch error
        message = _.str.truncate(jqXHR.responseText, 300)
    else
      message = gettext("Возможно, это связано с ошибкой на сервере или плохим интернет-сигналом. Попробуйте ещё раз.")
    msg = new CMS.Views.Notification.Error(
      "title": gettext("Возникли проблемы при сохранении")
      "message": message
    )
    msg.show()

  window.onTouchBasedDevice = ->
    navigator.userAgent.match /iPhone|iPod|iPad/i

  $('body').addClass 'touch-based-device' if onTouchBasedDevice()
