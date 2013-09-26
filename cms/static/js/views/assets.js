// This code is temporarily moved out of asset_index.html
// to fix AWS pipelining issues. We can move it back after RequireJS is integrated.
$(document).ready(function() {
    $('.uploads .upload-button').bind('click', showUploadModal);
    $('.upload-modal .close-button').bind('click', hideModal);
    $('.upload-modal .choose-file-button').bind('click', showFileSelectionMenu);
});

var showUploadModal = function (e) {
    e.preventDefault();

/*
    var that = this;
    var msg = new CMS.Views.Prompt.Warning({
        title: gettext("Подтверждение удаления"),
        message: gettext("Вы действительно хотите удалить файл?\n\nСсылки, которые ведут на этот файл, перестанут работать"),
        actions: {
            primary: {
                text: gettext("OK"),
                click: function(view) {
                    // call the back-end to actually remove the asset
                    var url = $('.asset-library').data('remove-asset-callback-url');
                    var row = $(that).closest('tr');
                    $.post(url,
                        { 'location': row.data('id') },
                        function() {
                            // show the post-commit confirmation
                            var deleted = new CMS.Views.Notification.Confirmation({
                                title: gettext("Файл удален."),
                                closeIcon: false,
                                maxShown: 2000
                            });
                            deleted.show();
                            row.remove();
                            analytics.track('Deleted Asset', {
                                'course': course_location_analytics,
                                'id': row.data('id')
                            });
                        }
                    );
                    view.hide();
                }
            },
            secondary: [{
                text: gettext("Отмена"),
                click: function(view) {
                    view.hide();
                }
            }]
*/
    resetUploadModal();
    // $modal has to be global for hideModal to work.
    $modal = $('.upload-modal').show();
    $('.file-input').bind('change', startUpload);
    $('.upload-modal .file-chooser').fileupload({
        dataType: 'json',
        type: 'POST',
        maxChunkSize: 100 * 1000 * 1000,      // 100 MB
        autoUpload: true,
        progressall: function(e, data) {
            var percentComplete = parseInt((100 * data.loaded) / data.total, 10);
            showUploadFeedback(e, percentComplete);
        },
        maxFileSize: 100 * 1000 * 1000,   // 100 MB
        maxNumberofFiles: 100,
        add: function(e, data) {
            data.process().done(function () {
                data.submit();
            });
        },
        done: function(e, data) {
            displayFinishedUpload(data.result);
        }

    });

    $modalCover.show();
};

var showFileSelectionMenu = function(e) {
    e.preventDefault();
    $('.file-input').click();
};

var startUpload = function (e) {
    var file = e.target.value;



    $('.upload-modal h1').html(gettext('Загружается…'));
    $('.upload-modal .file-name').html(file.substring(file.lastIndexOf("\\") + 1));
    $('.upload-modal .choose-file-button').hide();
    $('.upload-modal .progress-bar').removeClass('loaded').show();
};

var resetUploadModal = function () {
    $('.file-input').unbind('change', startUpload);

    // Reset modal so it no longer displays information about previously
    // completed uploads.
    var percentVal = '0%';
    $('.upload-modal .progress-fill').width(percentVal);
    $('.upload-modal .progress-fill').html(percentVal);
    $('.upload-modal .progress-bar').hide();

    $('.upload-modal .file-name').show();
    $('.upload-modal .file-name').html('');
    $('.upload-modal .choose-file-button').html(gettext('Choose File'));
    $('.upload-modal .embeddable-xml-input').val('');
    $('.upload-modal .embeddable').hide();
};

var showUploadFeedback = function (event, percentComplete) {
    var percentVal = percentComplete + '%';
    $('.upload-modal .progress-fill').width(percentVal);
    $('.upload-modal .progress-fill').html(percentVal);
};

var displayFinishedUpload = function (resp) {
    var asset = resp.asset;

    $('.upload-modal h1').html(gettext('Upload New File'));
    $('.upload-modal .embeddable-xml-input').val(asset.portable_url);
    $('.upload-modal .embeddable').show();
    $('.upload-modal .file-name').hide();
    $('.upload-modal .progress-fill').html(resp.msg);
    $('.upload-modal .choose-file-button').html(gettext('Загрузить ещё один файл')).show();
    $('.upload-modal .progress-fill').width('100%');

    // TODO remove setting on window object after RequireJS.
    window.assetsView.addAsset(new CMS.Models.Asset(asset));
};
