// Main
require([
  'jquery',
  'bootstrap/transition',
  'bootstrap/collapse',
  ], function ($, bt, bc) {
    var resizeViewPort = function () {
      /* resizes the main element,
         in order to always push footer to the bottom */

      $('main').css({'min-height': function () {
        return  ($(window).height() -
                  ($('nav.main-navigation').outerHeight(true) +
                    $('footer.main-footer').outerHeight(true))) + 'px';
      }});
    };

    $( document ).ready(function() {

      $(window).on('resize', resizeViewPort).trigger('resize');
      //debug
      console.log('hello');
      // $('#myModal').foundation('reveal', 'open');
    });
});