require(["domReady", "jquery", "underscore", "gettext", "js/views/feedback_notification", "js/views/feedback_prompt",
    "js/utils/get_date", "js/utils/module", "js/utils/handle_iframe_binding", "jquery.ui", "jquery.leanModal", "jquery.form", "jquery.smoothScroll", "select2"],
    function(domReady, $, _, gettext, NotificationView, PromptView, DateUtils, ModuleUtils, IframeUtils) {

var $body;
var $newComponentItem;
var $changedInput;
var $spinner;
var $newComponentTypePicker;
var $newComponentTemplatePickers;
var $newComponentButton;

domReady(function() {
    $body = $('body');

    $newComponentItem = $('.new-component-item');
    $newComponentTypePicker = $('.new-component');
    $newComponentTemplatePickers = $('.new-component-templates');
    $newComponentButton = $('.new-component-button');
    $spinner = $('<span class="spinner-in-field-icon"></span>');

    $body.on('click', '.embeddable-xml-input', function() {
        $(this).select();
    });

    $('body').addClass('js');

    $('.unit .item-actions .delete-unit-button').bind('click', deleteUnit);
    $('.new-unit-item').bind('click', createNewUnit);
    //$('.show-graph-item').bind('click', graphPopUpWindow);

    // lean/simple modal
    $('a[rel*=modal]').leanModal({
        overlay: 0.80,
        closeButton: '.action-modal-close'
    });
    $('a.action-modal-close').click(function(e) {
        (e).preventDefault();
    });

    // alerts/notifications - manual close
    $('.action-alert-close, .alert.has-actions .nav-actions a').bind('click', hideAlert);
    $('.action-notification-close').bind('click', hideNotification);

    // nav - dropdown related
    $body.click(function(e) {
        $('.nav-dd .nav-item .wrapper-nav-sub').removeClass('is-shown');
        $('.nav-dd .nav-item .title').removeClass('is-selected');
    });

    $('.nav-dd .nav-item').click(function(e) {

        $subnav = $(this).find('.wrapper-nav-sub');
        $title = $(this).find('.title');

        if ($subnav.hasClass('is-shown')) {
            $subnav.removeClass('is-shown');
            $title.removeClass('is-selected');
        } else {
            $('.nav-dd .nav-item .title').removeClass('is-selected');
            $('.nav-dd .nav-item .wrapper-nav-sub').removeClass('is-shown');
            $title.addClass('is-selected');
            $subnav.addClass('is-shown');
            // if propagation is not stopped, the event will bubble up to the
            // body element, which will close the dropdown.
            e.stopPropagation();
        }
    });

    // general link management - new window/tab
    $('a[rel="external"]').attr('title', gettext('This link will open in a new browser window/tab')).bind('click', linkNewWindow);

    // general link management - lean modal window
    $('a[rel="modal"]').attr('title', gettext('This link will open in a modal window')).leanModal({
        overlay: 0.50,
        closeButton: '.action-modal-close'
    });
    $('.action-modal-close').click(function(e) {
        (e).preventDefault();
    });

    // general link management - smooth scrolling page links
    $('a[rel*="view"][href^="#"]').bind('click', smoothScrollLink);

    // tender feedback window scrolling
    $('a.show-tender').bind('click', smoothScrollTop);

    // autosave when leaving input field
    $body.on('change', '.subsection-display-name-input', saveSubsection);
    $('.subsection-display-name-input').each(function() {
        this.val = $(this).val();
    });
    $("#start_date, #start_time, #due_date, #due_time").bind('change', autosaveInput);
    $('.sync-date, .remove-date').bind('click', autosaveInput);

    // expand/collapse methods for optional date setters
    $('.set-date').bind('click', showDateSetter);
    $('.remove-date').bind('click', removeDateSetter);

    $('.delete-section-button').bind('click', deleteSection);
    $('.delete-subsection-button').bind('click', deleteSubsection);

    // save subsection
    $('.save-subsection-button').bind('click', saveSubsectionOnButton);
    function saveSubsectionOnButton(){

      $('.save-subsection-button').val(gettext("Saving&hellip;"));
      $('.save-subsection-button').addClass("save-subsection-button-active");
      saveSubsection();
      setTimeout('$(".save-subsection-button").val("' + gettext('Save')+'"); $(".save-subsection-button").removeClass("save-subsection-button-active");', 1500);

    }



    $('.sync-date').bind('click', syncReleaseDate);

    // section date setting
    $('.set-publish-date').bind('click', setSectionScheduleDate);
    $('.edit-section-start-cancel').bind('click', cancelSetSectionScheduleDate);

    $body.on('change', '.edit-subsection-publish-settings .start-date', function() {
        if ($('.edit-subsection-publish-settings').find('.start-time').val() == '') {
            $('.edit-subsection-publish-settings').find('.start-time').val('12:00am');
        }
    });
    $('.edit-subsection-publish-settings').on('change', '.start-date, .start-time', function() {
        $('.edit-subsection-publish-settings').find('.save-button').show();
    });

    IframeUtils.iframeBinding();
});

function smoothScrollLink(e) {
    (e).preventDefault();

    $.smoothScroll({
        offset: -200,
        easing: 'swing',
        speed: 1000,
        scrollElement: null,
        scrollTarget: $(this).attr('href')
    });
}

function smoothScrollTop(e) {
    (e).preventDefault();

    $.smoothScroll({
        offset: -200,
        easing: 'swing',
        speed: 1000,
        scrollElement: null,
        scrollTarget: $('#view-top')
    });
}

function linkNewWindow(e) {
    window.open($(e.target).attr('href'));
    e.preventDefault();
}

function syncReleaseDate(e) {
    e.preventDefault();
    $(this).closest('.notice').hide();
    $("#start_date").val("");
    $("#start_time").val("");
}


function autosaveInput(e) {
    var self = this;
    if (this.saveTimer) {
        clearTimeout(this.saveTimer);
    }

    this.saveTimer = setTimeout(function() {
        $changedInput = $(e.target);
        saveSubsection();
        self.saveTimer = null;
    }, 500);
}

function saveSubsection() {
    // Spinner is no longer used by subsection name, but is still used by date and time pickers on the right.
    if ($changedInput && !$changedInput.hasClass('no-spinner')) {
        $spinner.css({
            'position': 'absolute',
            'top': Math.floor($changedInput.position().top + ($changedInput.outerHeight() / 2) + 3),
            'left': $changedInput.position().left + $changedInput.outerWidth() - 24,
            'margin-top': '-10px'
        });
        $changedInput.after($spinner);
        $spinner.show();
    }

    var locator = $('.subsection-body').data('locator');

    // pull all 'normalized' metadata editable fields on page
    // добавлено поле select
    var metadata_fields = $('input[data-metadata-name], select[data-metadata-name]');

    var metadata = {};
    for (var i = 0; i < metadata_fields.length; i++) {
        var el = metadata_fields[i];
        metadata[$(el).data("metadata-name")] = el.value;
    }

    // get datetimes for start and due, stick into metadata
    _(["start", "due"]).each(function(name) {

        var datetime = DateUtils(
            document.getElementById(name+"_date"),
            document.getElementById(name+"_time")
        );
        // if datetime is null, we want to set that in metadata anyway;
        // its an indication to the server to clear the datetime in the DB
        metadata[name] = datetime;
    });

    var tags = [];
    // extract values from each object in array
    $("#tags-select").select2("data").forEach(function(item) {
        tags.push(+$(item.element).val());
    });
    metadata["tags"] = tags;

    $.ajax({
        url: ModuleUtils.getUpdateUrl(locator),
        type: "PUT",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            'metadata': metadata
        }),
        success: function() {
            $spinner.delay(500).fadeOut(150);
            $changedInput = null;
        }
    });
}

function graphPopUpWindow(e) {
    e.preventDefault();

    //var tmp = $(e.currentTarget).attr("data-parent")
    //console.log(tmp)

    var url = "/graph/subsection/" + $(e.currentTarget).attr("data-parent");

    window.open(url,'popupWindow',
        'toolbar=no,location=no,fullscreen=yes,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no');

}

function createNewUnit(e) {
    e.preventDefault();

    var parent = $(this).data('parent');
    var category = $(this).data('category');

    analytics.track('Created a Unit', {
        'course': course_location_analytics,
        'parent_locator': parent
    });


    $.postJSON(ModuleUtils.getUpdateUrl(), {
        'parent_locator': parent,
        'category': category,
        'display_name': gettext('New Unit')
    },

    function(data) {
        // redirect to the edit page
        window.location = "/unit/" + data['locator'];
    });
}

function deleteUnit(e) {
    e.preventDefault();
    var as_source_unit = $(this).parents('li.courseware-unit').data("dependent_units")["as_source_unit"];
    var direct_units = $(this).parents('li.courseware-unit').data("dependent_units")["direct_units"];
    var as_direct_unit = $(this).parents('li.courseware-unit').data("dependent_units")["as_direct_unit"];
    var direct_units_list = "";
    var as_source_unit_list = "";
    var as_direct_unit_list = "";
    var additional_html = "";



    $.each(as_direct_unit,function(id,value){
        as_direct_unit_list += "<li><a href = '" + value.url + "'>" + value.name + "</a></li>";
    });

    $.each(direct_units,function(id,value){
        direct_units_list += "<li><a href = '" + value.url + "'>" + value.name + "</a></li>";
    });

    $.each(as_source_unit,function(id,value){
        as_source_unit_list += "<li><a href = '" + value.url + "'>" + value.name + "</a></li>";
    });


    if (as_direct_unit_list){
        additional_html += "<h3>" + gettext("Dependencies as direct unit:") +
            "</h3><ul>" + as_direct_unit_list + "</ul>";
    }

    if (direct_units_list){
        additional_html += "<h3>" + gettext("Direct units are:") +
            "</h3><ul>" + direct_units_list + "</ul>";
    }

    if (as_source_unit_list){
        additional_html += "<h3>" + gettext("Dependencies as source unit:") +
            "</h3><ul>" + as_source_unit_list + "</ul>";
    }

    if (direct_units_list || as_source_unit_list || as_direct_unit_list){
        additional_html += "<p>" + gettext("Direct terms in depended units will be cleaned") + "</p>";
    }

    _deleteItem($(this).parents('li.courseware-unit'), 'Unit', additional_html);
}

function deleteSubsection(e) {
    e.preventDefault();
    _deleteItem($(this).parents('li.courseware-subsection'), 'Subsection', "");
}

function deleteSection(e) {
    e.preventDefault();
    _deleteItem($(this).parents('section.courseware-section'), 'Section', "");
}

function _deleteItem($el, type, additional_html) {
    var confirm = new PromptView.Warning({
        title: gettext('Delete this ' + type + '?'),
        message: gettext('Deleting this ' + type + ' is permanent and cannot be undone.') + additional_html,
        actions: {
            primary: {
                text: gettext('Yes, delete this ' + type),
                click: function(view) {
                    view.hide();

                    var locator = $el.data('locator');

                    analytics.track('Deleted an Item', {
                        'course': course_location_analytics,
                        'id': locator
                    });

                    var deleting = new NotificationView.Mini({
                        title: gettext('Deleting&hellip;')
                    });
                    deleting.show();

                    $.ajax({
                        type: 'DELETE',
                        url: ModuleUtils.getUpdateUrl(locator) +'?'+ $.param({recurse: true, all_versions: true}),
                        success: function () {
                            $el.remove();
                            deleting.hide();
                        }
                    });
                }
            },
            secondary: {
                text: gettext('Cancel'),
                click: function(view) {
                    view.hide();
                }
            }
        }
    });
    confirm.show();
}

function showDateSetter(e) {
    e.preventDefault();
    var $block = $(this).closest('.due-date-input');
    $(this).hide();
    $block.find('.date-setter').show();
}

function removeDateSetter(e) {
    e.preventDefault();
    var $block = $(this).closest('.due-date-input');
    $block.find('.date-setter').hide();
    $block.find('.set-date').show();
    // clear out the values
    $block.find('.date').val('');
    $block.find('.time').val('');
}

function hideNotification(e) {
    (e).preventDefault();
    $(this).closest('.wrapper-notification').removeClass('is-shown').addClass('is-hiding').attr('aria-hidden', 'true');
}

function hideAlert(e) {
    (e).preventDefault();
    $(this).closest('.wrapper-alert').removeClass('is-shown');
}

function setSectionScheduleDate(e) {
    e.preventDefault();
    $(this).closest("h4").hide();
    $(this).parent().siblings(".datepair").show();
}

function cancelSetSectionScheduleDate(e) {
    e.preventDefault();
    $(this).closest(".datepair").hide();
    $(this).parent().siblings("h4").show();
}

    window.deleteSection = deleteSection;

}); // end require()
