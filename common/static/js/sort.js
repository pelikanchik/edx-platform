$('ul.sorting').each(function () {
    var selectedValue = $('ul.sorting').val();
    $(this).html($('li', $(this)).sort(function (a, b) {
        var arel = parseInt($(a).children('section').children('div').children('input').attr('value'));
        var brel = parseInt($(b).children('section').children('div').children('input').attr('value'));
        return arel == brel ? 0 : arel != Math.max(arel,brel) ? -1 : 1
    }));
    $(this).val(selectedValue);
});