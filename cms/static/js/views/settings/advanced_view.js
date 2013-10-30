if (!CMS.Views['Settings']) CMS.Views.Settings = {};

CMS.Views.Settings.Advanced = CMS.Views.ValidatingView.extend({
    error_saving : "error_saving",
    successful_changes: "successful_changes",

    // Model class is CMS.Models.Settings.Advanced
    events : {
        'focus :input' : "focusInput",
        'blur :input' : "blurInput"
        // TODO enable/disable save based on validation (currently enabled whenever there are changes)
    },
    initialize : function() {
        this.template = _.template($("#advanced_entry-tpl").text());
        this.listenTo(this.model, 'invalid', this.handleValidationError);
        this.render();
    },
    render: function() {
        // catch potential outside call before template loaded
        if (!this.template) return this;

        var listEle$ = this.$el.find('.course-advanced-policy-list');
        listEle$.empty();

        // b/c we've deleted all old fields, clear the map and repopulate
        this.fieldToSelectorMap = {};
        this.selectorToField = {};

        // iterate through model and produce key : value editors for each property in model.get
        var self = this;
        listEle$.append(self.renderTemplate("available_for_demo", self.model.get("available_for_demo")));
        listEle$.append(self.renderTemplate("show_in_lms", self.model.get("show_in_lms")));
        _.each(_.sortBy(_.keys(this.model.attributes), _.identity),
            function(key) {
                if (key != "available_for_demo" && key != "show_in_lms"){
                    listEle$.append(self.renderTemplate(key, self.model.get(key)));
                }
            });

        var policyValues = listEle$.find('.boolean');
        _.each(policyValues, this.attachBooleanEditor, this);
        var policyValues = listEle$.find('.json');
        _.each(policyValues, this.attachJSONEditor, this);
        return this;
    },

    attachBooleanEditor : function (select) {
        var self = this;
        var oldValue = $(select).val();
        $(select).change(function(){

            var message = gettext("Ваши изменения не вступят в силу пока вы их не сохраните.");

            self.model.set($(select).attr("rel"),$(select).val())
            self.showNotificationBar(message,
                                             _.bind(self.saveView, self),
                                             _.bind(self.revertView, self));
        });
    },
    attachJSONEditor : function (textarea) {
        // Since we are allowing duplicate keys at the moment, it is possible that we will try to attach
        // JSON Editor to a value that already has one. Therefore only attach if no CodeMirror peer exists.
        if ( $(textarea).siblings().hasClass('CodeMirror')) {
            return;
        }
        var self = this;
        var oldValue = $(textarea).val();
        //self.showNotificationBar(message,_.bind(self.saveView, self),_.bind(self.revertView, self));

        CodeMirror.fromTextArea(textarea, {
            mode: "application/json", lineNumbers: false, lineWrapping: false,
            onChange: function(instance, changeobj) {
                instance.save();
                // this event's being called even when there's no change :-(
                if (instance.getValue() !== oldValue) {
                    var message = gettext("Ваши изменения не вступят в силу пока вы их не сохраните.");
                    self.showNotificationBar(message,
                                             _.bind(self.saveView, self),
                                             _.bind(self.revertView, self));
                }
            },
            onFocus : function(mirror) {
              $(textarea).parent().children('label').addClass("is-focused");
            },
            onBlur: function (mirror) {
                $(textarea).parent().children('label').removeClass("is-focused");
                var key = $(mirror.getWrapperElement()).closest('.field-group').children('.key').attr('id');
                var stringValue = $.trim(mirror.getValue());
                // update CodeMirror to show the trimmed value.
                mirror.setValue(stringValue);
                var JSONValue = undefined;
                try {
                    JSONValue = JSON.parse(stringValue);
                } catch (e) {
                    // If it didn't parse, try converting non-arrays/non-objects to a String.
                    // But don't convert single-quote strings, which are most likely errors.
                    var firstNonWhite = stringValue.substring(0, 1);
                    if (firstNonWhite !== "{" && firstNonWhite !== "[" && firstNonWhite !== "'") {
                        try {
                            stringValue = '"'+stringValue +'"';
                            JSONValue = JSON.parse(stringValue);
                            mirror.setValue(stringValue);
                        } catch(quotedE) {
                            // TODO: validation error
                            // console.log("Error with JSON, even after converting to String.");
                            // console.log(quotedE);
                            JSONValue = undefined;
                        }
                    }
                }
                if (JSONValue !== undefined) {
                    self.model.set(key, JSONValue);
                }
            }
        });
    },
    saveView : function() {
        // TODO one last verification scan:
        //    call validateKey on each to ensure proper format
        //    check for dupes
        var self = this;
        this.model.save({}, {
            success : function() {
                self.render();
                var title = gettext("Ваши изменения сохранены.");
                var message = gettext("Пожалуйста, обратите внимание, что проверки пар ключей и значений в настоящее время еще нет. Если у вас возникли трудности, пожалуйста, пересмотрите политику пар.");
                self.showSavedBar(title, message);
                analytics.track('Saved Advanced Settings', {
                    'course': course_location_analytics
                });
            },
            silent: true
        });
    },
    revertView: function() {
        var self = this;
        this.model.fetch({
            success: function() { self.render(); },
            reset: true
        });
    },
    renderTemplate: function (key, value) {
        var newKeyId = _.uniqueId('policy_key_'),
        newEle = this.template({ key : key, value : JSON.stringify(value, null, 4),
            keyUniqueId: newKeyId, valueUniqueId: _.uniqueId('policy_value_')});

        this.fieldToSelectorMap[key] = newKeyId;
        this.selectorToField[newKeyId] = key;
        return newEle;
    },
    focusInput : function(event) {
        $(event.target).prev().addClass("is-focused");
    },
    blurInput : function(event) {
        $(event.target).prev().removeClass("is-focused");
    }
});
