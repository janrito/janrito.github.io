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
  // urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    "jquery": "vendor/jquery/dist/jquery",

    /* Bootstrap */
    'bootstrap': 'vendor/bootstrap-sass-official/assets/javascripts/bootstrap',

    // Google Analytics
    'EventEmitter': 'vendor/event-emitter/dist/EventEmitter',
    'GA': 'vendor/requirejs-google-analytics/dist/GoogleAnalytics',

  },
  shim: {
    'bootstrap/affix':      { deps: ['jquery'], exports: '$.fn.affix' },
    'bootstrap/alert':      { deps: ['jquery'], exports: '$.fn.alert' },
    'bootstrap/button':     { deps: ['jquery'], exports: '$.fn.button' },
    'bootstrap/carousel':   { deps: ['jquery'], exports: '$.fn.carousel' },
    'bootstrap/collapse':   { deps: ['jquery'], exports: '$.fn.collapse' },
    'bootstrap/dropdown':   { deps: ['jquery'], exports: '$.fn.dropdown' },
    'bootstrap/modal':      { deps: ['jquery'], exports: '$.fn.modal' },
    'bootstrap/popover':    { deps: ['jquery'], exports: '$.fn.popover' },
    'bootstrap/scrollspy':  { deps: ['jquery'], exports: '$.fn.scrollspy' },
    'bootstrap/tab':        { deps: ['jquery'], exports: '$.fn.tab' },
    'bootstrap/tooltip':    { deps: ['jquery'], exports: '$.fn.tooltip' },
    'bootstrap/transition': { deps: ['jquery'], exports: '$.fn.transition' }
  },

  deps: [
  'js/main'
  ]
});

