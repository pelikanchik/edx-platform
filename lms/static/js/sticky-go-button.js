/*!
 * making "forward" button stay in place when its
 * original position is visible
 * and stick to the browser window otherwise
 */

$(document).ready(function () {

var marginTopInPx = parseInt($('div.godynamo #go-button').css("margin-top"));
var offsetTop = $('.godynamo').offset().top;

var origOffsetY = offsetTop + marginTopInPx;

    function onScroll(e) {
  if (window.scrollY >= origOffsetY)
    {
        $('.godynamo').addClass('godynamo-float').removeClass("godynamo-static");
    }
    else {
        $('.godynamo').removeClass('godynamo-float').addClass("godynamo-static");
    }
}


document.addEventListener('scroll', onScroll);

});


