//The build will inline common dependencies into this file.
//For any third party dependencies, like jQuery, place them in the lib folder.
//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
  config: {
    'GA': {
      'id' : 'UA-3614475-10'
    }
  },

  baseUrl: "/assets",
  urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    "jquery": "vendor/jquery/dist/jquery.min",

    // Google Analytics
    'EventEmitter': 'vendor/event-emitter/dist/EventEmitter',
    'GA': 'vendor/requirejs-google-analytics/dist/GoogleAnalytics',
  },
});