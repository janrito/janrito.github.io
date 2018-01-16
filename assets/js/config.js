SystemJS.config({
  baseURL: '/assets/',
  map: {
    "jQuery": "vendor/jquery/dist/jquery.min.js",
    "Popper": "vendor/popper.js/dist/umd/popper.min.js",
    "bootstrap": "vendor/bootstrap/dist/js/bootstrap.bundle.min.js",
    "ga": "//www.google-analytics.com/analytics.js"
  },
  meta: {
    'jQuery': {
      format: 'global',
      exports: 'jQuery',
    },
    'Popper': {
      format: 'global',
      exports: 'Popper',
    },
    'bootstrap': {
      format: 'global',
      exports: 'bootstrap',
      globals: {
        'jQuery': 'jQuery',
        'Popper': 'Popper'
      },
      deps: ['jQuery', 'Popper'],
    },
    'ga': {
      exports: 'ga',
      format: 'global'
    }
  },

});