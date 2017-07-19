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
    ], function ($,) {
      $( document ).ready(function() {
        console.log('hello');
      });
  });

});