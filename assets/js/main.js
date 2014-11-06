// Main
require([
  'jquery',
  'GA',
  'bootstrap/transition',
  'bootstrap/collapse',
  ], function ($, GA, bt, bc) {

    var resizePositioning = function () {
      resizeViewPort();
      imagesBaselineFix();
    };

    var imagesBaselineFix = function () {
      var lineHeight = $('main p').first().css('line-height') || '0',
          lineHeightComputed = parseInt(lineHeight.replace('px', ''));
      $('main img').each(function() {
            var $this = $(this),
                height = $this.outerHeight(false),
                extra =((height) % (lineHeightComputed)),
                newMargin = lineHeightComputed - extra;

          $this.css('margin-bottom', newMargin);
      });
    };

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

      $(window).on('resize', resizePositioning).trigger('resize');
      //debug
      console.log('hello');
      // $('#myModal').foundation('reveal', 'open');
    });

    GA.ready(function (ga) {
        // GA is fully loaded
        console.log(ga);
    });
});
