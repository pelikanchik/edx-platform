if (!CMS.Views['Settings']) CMS.Views.Settings = {};

CMS.Views.Settings.Details = CMS.Views.ValidatingView.extend({
    // Model class is CMS.Models.Settings.CourseDetails
    events : {
        "input input" : "updateModel",
        "input textarea" : "updateModel",
        "change input" : "updateModel",
        "change textarea" : "updateModel",
        'click .remove-course-introduction-video' : "removeVideo",
        'focus #course-overview' : "codeMirrorize",
        'mouseover #timezone' : "updateTime",
        'focus :input' : "inputFocus",
        'blur :input' : "inputUnfocus",
        'click .action-upload-image': "uploadImage"
    },

    initialize : function() {
        this.fileAnchorTemplate = _.template('<a href="<%= fullpath %>"> <i class="icon-file"></i><%= filename %></a>');
        // fill in fields
        this.$el.find("#course-name").val(this.model.get('location').get('name'));
        this.$el.find("#course-organization").val(this.model.get('location').get('org'));
        this.$el.find("#course-number").val(this.model.get('location').get('course'));
        this.$el.find('.set-date').datepicker({ 'dateFormat': 'd.m.yy' });

        // Avoid showing broken image on mistyped/nonexistent image
        this.$el.find('img.course-image').error(function() {
            $(this).hide();
        });
        this.$el.find('img.course-image').load(function() {
            $(this).show();
        });

        var dateIntrospect = new Date();
        this.$el.find('#timezone').html("(" + dateIntrospect.getTimezone() + ")");

        this.listenTo(this.model, 'invalid', this.handleValidationError);
        this.listenTo(this.model, 'change', this.showNotificationBar);
        this.selectorToField = _.invert(this.fieldToSelectorMap);
    },

    render: function() {
        _this = this;
        this.setupDatePicker('start_date');
        this.setupDatePicker('end_date');
        this.setupDatePicker('enrollment_start');
        this.setupDatePicker('enrollment_end');

        this.$el.find('#' + this.fieldToSelectorMap['overview']).val(this.model.get('overview'));
        this.codeMirrorize(null, $('#course-overview')[0]);


        // подставляет в поле с тэгом значение из базы
        this.$el.find('#' + this.fieldToSelectorMap['tags']).val(this.model.get('tags'));

        appended_tags = this.model.get('tags');

        // Если значение непусто - парсим, иначе подставляем пустое значение по умолчанию.
        // Этот объект съест дерево
        if (appended_tags){
            tags_dict = JSON.parse(appended_tags);
        }
        else{
            tags_dict = []
        }

      $(function(){
        // Инициализация дерева
        $("#tree").dynatree({
          children: tags_dict,
          title: "Дерево тэгов",
          onActivate: function(node) {
            $("#tag-title").val(node.data.title);
            $("#current").css("visibility","visible");
            if( node.data.url )
              window.open(node.data.url, node.data.target);
          },
          onDeactivate: function(node) {
            $("#current").css("visibility","hidden");
          },

          dnd: {

              // описывает, что происходит при перетаскивании элементов внутри дерева

              preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
              onDragStart: function(node) {
                return true;
              },
              onDragEnter: function(node, sourceNode) {

                // есть два состояния: перетащить после элемента и засунуть внутрь элемента
                return ["after", "over"];
              },
              onDrop: function(node, sourceNode, hitMode, ui, draggable) {
                // при отпускании совершаем перемещение и сохраняем
                sourceNode.move(node, hitMode);
                saveTree();
              }
          }

        });

        // добавление тэга
        $("#btnAddCode").click(function(){
          var title;
          if (title = prompt("Введите название для тэга")){

              var rootNode = $("#tree").dynatree("getRoot");
              var d = new Date();
              var randval = "id" + d.getTime() + "_"  + Math.floor(Math.random() * 9999999 + 1);
              var childNode = rootNode.addChild({
                title: title,
                isFolder: false,
                key:randval
              });
              saveTree();
          }
        });


        // изменение тэга
        $("#btnSetTitle").click(function(){
          var node = $("#tree").dynatree("getActiveNode");
          if( !node ) return;
          node.setTitle($('#tag-title').attr("value"));
          saveTree();
        });

        // удаление тэга
        $("#btnDelete").click(function(){
          if (confirm("Вы уверены, что хотите удалить этот тэг? Связь с соответствущими тэгу заданиями будет удалена")){
              var node = $("#tree").dynatree("getActiveNode");
              if( !node ) return;
              node.remove();
              saveTree();
          }

        });

        // Сохранение дерева: приведение к правильному json-у того, что получилось в дереве.
        // Извращение связано с тем, что при инициализации создаётся корень дерева, к которому
        // присоединяются потомки. Соотвественно, при сохранении пустой корень дерева удаляется,
        // т.к. иначе идёт нарастание вложенности.
        function saveTree(){
          var top_level_tags = $("#tree").dynatree("getRoot").getChildren();

          var output_json = "";
          if (top_level_tags){
            $.each(top_level_tags, function(index, value) {
              if (index == 0){
                  output_json = JSON.stringify(value.toDict(true));
              } else {
                  output_json = output_json + "," + JSON.stringify(value.toDict(true));
              }
            });
          }

          output_json = "[" + output_json + "]";

          // сначала - в невидимое поле
          $('#course-tags').val(output_json);
          // затем - запрос к базе
          _this.setAndValidate("tags", output_json);

        };

      });




        //this.codeMirrorize(null, $('#course-tags')[0]);

        this.$el.find('.current-course-introduction-video iframe').attr('src', this.model.videosourceSample());
        this.$el.find('#' + this.fieldToSelectorMap['intro_video']).val(this.model.get('intro_video') || '');
        if (this.model.has('intro_video')) {
            this.$el.find('.remove-course-introduction-video').show();
        }
        else this.$el.find('.remove-course-introduction-video').hide();

        this.$el.find('#' + this.fieldToSelectorMap['effort']).val(this.model.get('effort'));

        var imageURL = this.model.get('course_image_asset_path');
        this.$el.find('#course-image-url').val(imageURL)
        this.$el.find('#course-image').attr('src', imageURL);

        return this;
    },
    fieldToSelectorMap : {
        'start_date' : "course-start",
        'end_date' : 'course-end',
        'enrollment_start' : 'enrollment-start',
        'enrollment_end' : 'enrollment-end',
        'overview' : 'course-overview',
        'tags' : 'course-tags',
        'intro_video' : 'course-introduction-video',
        'effort' : "course-effort",
        'course_image_asset_path': 'course-image-url'
    },

    updateTime : function(e) {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        $(e.currentTarget).attr('title', (hours % 12 === 0 ? 12 : hours % 12) + ":" + (minutes < 10 ? "0" : "")  +
                now.getMinutes() + (hours < 12 ? "am" : "pm") + " (current local time)");
    },

    setupDatePicker: function (fieldName) {
        var cacheModel = this.model;
        var div = this.$el.find('#' + this.fieldToSelectorMap[fieldName]);
        var datefield = $(div).find("input:.date");
        var timefield = $(div).find("input:.time");
        var cachethis = this;
        var setfield = function () {
            var date = datefield.datepicker('getDate');
            if (date) {
                var time = timefield.timepicker("getSecondsFromMidnight");
                if (!time) {
                    time = 0;
                }
                var newVal = new Date(date.getTime() + time * 1000);
                if (!cacheModel.has(fieldName) || cacheModel.get(fieldName).getTime() !== newVal.getTime()) {
                    cachethis.clearValidationErrors();
                    cachethis.setAndValidate(fieldName, newVal);
                }
            }
            else {
                // Clear date (note that this clears the time as well, as date and time are linked).
                // Note also that the validation logic prevents us from clearing the start date
                // (start date is required by the back end).
                cachethis.clearValidationErrors();
                cachethis.setAndValidate(fieldName, null);
            }
        };

        // instrument as date and time pickers
        timefield.timepicker({'timeFormat' : 'H:i'});
        datefield.datepicker();

        // Using the change event causes setfield to be triggered twice, but it is necessary
        // to pick up when the date is typed directly in the field.
        datefield.change(setfield);
        timefield.on('changeTime', setfield);
        timefield.on('input', setfield);

        datefield.datepicker('setDate', this.model.get(fieldName));
        // timepicker doesn't let us set null, so check that we have a time
        if (this.model.has(fieldName)) {
            timefield.timepicker('setTime', this.model.get(fieldName));
        } // but reset the field either way
        else {
            timefield.val('');
        }
    },

    updateModel: function(event) {
        switch (event.currentTarget.id) {
        case 'course-image-url':
            this.setField(event);
            var url = $(event.currentTarget).val();
            var image_name = _.last(url.split('/'));
            this.model.set('course_image_name', image_name);
            // Wait to set the image src until the user stops typing
            clearTimeout(this.imageTimer);
            this.imageTimer = setTimeout(function() {
                $('#course-image').attr('src', $(event.currentTarget).val());
            }, 1000);
            break;
        case 'course-effort':
            //alert("1");
            this.setField(event);
            break;
        // Don't make the user reload the page to check the Youtube ID.
        // Wait for a second to load the video, avoiding egregious AJAX calls.
        case 'course-introduction-video':
            //alert("2");
            this.clearValidationErrors();
            var previewsource = this.model.set_videosource($(event.currentTarget).val());
            clearTimeout(this.videoTimer);
            this.videoTimer = setTimeout(_.bind(function() {
                this.$el.find(".current-course-introduction-video iframe").attr("src", previewsource);
                if (this.model.has('intro_video')) {
                    this.$el.find('.remove-course-introduction-video').show();
                }
                else {
                    this.$el.find('.remove-course-introduction-video').hide();
                }
            }, this), 1000);
            break;
        default: // Everything else is handled by datepickers and CodeMirror.

            //alert("3");
            break;
        }
    },

    removeVideo: function(event) {
        event.preventDefault();
        if (this.model.has('intro_video')) {
            this.model.set_videosource(null);
            this.$el.find(".current-course-introduction-video iframe").attr("src", "");
            this.$el.find('#' + this.fieldToSelectorMap['intro_video']).val("");
            this.$el.find('.remove-course-introduction-video').hide();
        }
    },
    codeMirrors : {},
    codeMirrorize: function (e, forcedTarget) {
        var thisTarget;
        if (forcedTarget) {
            thisTarget = forcedTarget;
            thisTarget.id = $(thisTarget).attr('id');
        } else {
            thisTarget = e.currentTarget;
        }

        if (!this.codeMirrors[thisTarget.id]) {
            var cachethis = this;
            var field = this.selectorToField[thisTarget.id];
            this.codeMirrors[thisTarget.id] = CodeMirror.fromTextArea(thisTarget, {
                mode: "text", lineNumbers: true, lineWrapping: true,
                onChange: function (mirror) {
                    mirror.save();
                    cachethis.clearValidationErrors();
                    var newVal = mirror.getValue();
                    if (cachethis.model.get(field) != newVal) {
                        cachethis.setAndValidate(field, newVal);
                    }
                }
            });
        }
    },

    revertView: function() {
        // Make sure that the CodeMirror instance has the correct
        // data from its corresponding textarea
        var self = this;
        this.model.fetch({
            success: function() {
                self.render();
                _.each(self.codeMirrors,
                       function(mirror) {
                           var ele = mirror.getTextArea();
                           var field = self.selectorToField[ele.id];
                           mirror.setValue(self.model.get(field));
                       });
            },
            reset: true,
            silent: true});
    },
    setAndValidate: function(attr, value) {
        // If we call model.set() with {validate: true}, model fields
        // will not be set if validation fails. This puts the UI and
        // the model in an inconsistent state, and causes us to not
        // see the right validation errors the next time validate() is
        // called on the model. So we set *without* validating, then
        // call validate ourselves.
        this.model.set(attr, value);
        this.model.isValid();
    },

    showNotificationBar: function() {
        // We always call showNotificationBar with the same args, just
        // delegate to superclass
        CMS.Views.ValidatingView.prototype.showNotificationBar.call(this,
                                                                    this.save_message,
                                                                    _.bind(this.saveView, this),
                                                                    _.bind(this.revertView, this));
    },

    uploadImage: function(event) {
        event.preventDefault();
        var upload = new CMS.Models.FileUpload({
            title: gettext("Upload your course image."),
            message: gettext("Files must be in JPEG or PNG format."),
            mimeTypes: ['image/jpeg', 'image/png']
        });
        var self = this;
        var modal = new CMS.Views.UploadDialog({
            model: upload,
            onSuccess: function(response) {
                var options = {
                    'course_image_name': response.displayname,
                    'course_image_asset_path': response.url
                }
                self.model.set(options);
                self.render();
                $('#course-image').attr('src', self.model.get('course_image_asset_path'))
            }
        });
        $('.wrapper-view').after(modal.show().el);
    }
});

