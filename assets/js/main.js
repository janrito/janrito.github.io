// Main
require([
  'jquery',
  'foundation',
  ], function ($, fn) {

    $( document ).ready(function() {

      // load foundation
      $(document).foundation();

      //debug
      console.log('hello');

      // $('#myModal').foundation('reveal', 'open');
    });
});