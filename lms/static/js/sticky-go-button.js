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

var offsetTop = $('.go-button').offset().top;
var origOffsetY = offsetTop - paddingTopInPx;


//    console.log(parseInt($('.check-all').css("padding-top")));
//    console.log(parseInt($('.go-button').css("padding-top")));

var isFixed = false;

var initialOffset = 50;

$('.godynamo').css({
    'right': initialOffset
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
            $('.check-all').css({
                  'right': initialOffset
            });
            $('.godynamo').css({
                  'right': initialOffset
            });

            recalcOffset();

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

