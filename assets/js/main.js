require(['config'], function (config) {

  // setup google analytics
  require([
    'GA'
    ], function (GA) {

      GA.ready(function (ga) {
          // GA is fully loaded
          console.log('analytics is loaded');
      });
  });


  // Main
  require([
    'jquery',
    'bootstrap/transition',
    'bootstrap/collapse',
    'bootstrap/tooltip',
    ], function ($, bt, bc, btol) {

      var resizePositioning = function () {
        resizeViewPort();
        imagesBaselineFix();
      };

      var imagesBaselineFix = function () {
        // adjusts the lower margin for all images so that hte following text
        // matches the baseline on the rest of the document

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
         // resizes the main element,
         // in order to always push footer to the bottom

        $('main').css({'min-height': function () {
          return  ($(window).height() -
                    ($('nav.main-navigation').outerHeight(true) +
                      $('footer.main-footer').outerHeight(true))) + 'px';
        }});
      };

      $( document ).ready(function() {

        $(window).on('resize', resizePositioning).trigger('resize');
        $('[data-toggle="tooltip"]').tooltip();

        console.log('hello');

      });
  });

});