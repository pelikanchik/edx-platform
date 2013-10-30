/*!
 * making "forward" button stay in place when its
 * original position is visible
 * and stick to the browser window otherwise
 */

$(document).ready(function () {


//var marginTopInPx = parseInt($('.go-button').css("margin-top")) * 0;
//var offsetTop = $('.go-button').offset().top;
//var origOffsetY = offsetTop + marginTopInPx;

//var paddingTopInPx = parseInt($('.check-all').css("padding-top")) + parseInt($('.check-all').css("border-top-width"));
var paddingTopInPx = parseInt($('.check-all').css("padding-top"));
var marginTopInPx = parseInt($('.check-all').css("margin-top"));

var offsetTop = $('.check-all').offset().top;
var origOffsetY = offsetTop - paddingTopInPx + marginTopInPx;


//    console.log(parseInt($('.check-all').css("padding-top")));
//    console.log(parseInt($('.go-button').css("padding-top")));

var isFixed = false;

var initialOffset = parseInt($('.godynamo').css('right'));
//var initialOffset = 50;

$('.godynamo').css({
    'right': initialOffset}).css({
});
$('.check-all').css({
    'right': initialOffset
});

var magicValue = recalcHorizontalOffset();

    function recalcHorizontalOffset(){

//        var buttonSize = parseInt($('.go-button').css('padding-left')) + parseInt($('.go-button').css('padding-right')) +
//            $('.go-button').width() + parseInt($('.go-button').css('border-bottom-left-radius'));


        var buttonSize = parseInt($('.godynamo').css('padding-left')) + parseInt($('.godynamo').css('padding-right')) +
            parseInt($('.godynamo').css('border-bottom-left-radius'));
        //not sure about border-bottom-left-radius, maybe right is correct.


        // this formula was derived empirically
        var tmp = $(window).width() +
            buttonSize + initialOffset -   // to account for button size and right offset
            ($('.container').width()) -
            ($('.content-wrapper').width() - $('.container').width())/2;        // to account for gray background area

        return tmp;
    }

$(window).resize(function(){
    magicValue = recalcHorizontalOffset();

    // /!\
    // bugfix here

});

$(window).scroll(function(){
  if (window.scrollY >= origOffsetY)
    {
        $('.go-button').addClass('go-button-float').removeClass("go-button-static");
        if(!isFixed){
            $('.check-all').css({
                'margin-top' : 0
            });
            $('.godynamo').css({
                'margin-top' : 0
            });
        }
        isFixed = true;

    }
    else {
        $('.go-button').addClass("go-button-static").removeClass('go-button-float');
        if(isFixed){
            $('.check-all').css({
                  'right': initialOffset}).css({
                  'margin-top' : marginTopInPx
            });
            $('.godynamo').css({
                  'right': initialOffset}).css({
                  'margin-top' : marginTopInPx
            });

        }
        isFixed = false;
    }

    if(isFixed){
        $('.godynamo').css({
                'right': $(this).scrollLeft() + magicValue
        });
        $('.check-all').css({
            'right': $(this).scrollLeft() + magicValue
        });

    };

});

});

