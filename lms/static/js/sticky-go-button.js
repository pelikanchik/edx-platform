/*!
 * making "forward" button stay in place when its
 * original position is visible
 * and stick to the browser window otherwise
 */

$(document).ready(function () {

var marginTopInPx = parseInt($('.godynamo').css("margin-top"));
var offsetTop = $('.go-button').offset().top;

console.log(marginTopInPx);
console.log(offsetTop);

//var origOffsetY = offsetTop + marginTopInPx;
var origOffsetY = offsetTop + marginTopInPx;

    function onScroll(e) {
  if (window.scrollY >= origOffsetY)
    {
        $('.go-button').addClass('go-button-float').removeClass("go-button-static");
    }
    else {
        $('.go-button').removeClass('go-button-float').addClass("go-button-static");
    }
}


document.addEventListener('scroll', onScroll);

});


