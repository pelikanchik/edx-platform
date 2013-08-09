/*!
 * making "forward" button stay in place when its
 * original position is visible
 * and stick to the browser window otherwise
 */

$(document).ready(function () {


var width = parseInt($(".godynamo").css('width'));
var marginTopInPx = parseInt($('.godynamo').css("margin-top"));
var offsetTop = $('.go-button').offset().top;
var origOffsetY = offsetTop + marginTopInPx;

var isFixed = false;

var initialOffset = 0;

$('.godynamo').css({
    'right': initialOffset
});

var magicValue = recalcOffset();

    function recalcOffset(){

        var buttonSize = parseInt($('.godynamo').css('padding-left')) + parseInt($('.godynamo').css('padding-right')) +
            $('.godynamo').width() + parseInt($('.godynamo').css('border-bottom-left-radius'));
        //not sure about border-bottom-left-radius, maybe right is correct.


        // this formula was derived empirically
        var tmp = $(window).width() +
            buttonSize + initialOffset -   // to account for button size and right offset
            ($('.container').width()) -
            ($('.content-wrapper').width() - $('.container').width())/2;        // to account for gray background area

        return tmp;
    }

$(window).resize(function(){
    magicValue = recalcOffset();

});

$(window).scroll(function(){
  if (window.scrollY >= origOffsetY)
    {
        $('.go-button').addClass('go-button-float').removeClass("go-button-static");
        isFixed = true;
    }
    else {
        $('.go-button').addClass("go-button-static").removeClass('go-button-float');
        if(isFixed){
            $('.godynamo').css({
                  'right': initialOffset
            });
        }
        isFixed = false;
    }

    if(isFixed){
        $('.godynamo').css({
                'right': $(this).scrollLeft() - width + magicValue
        });
    };

});

});

