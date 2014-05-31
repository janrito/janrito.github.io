//The build will inline common dependencies into this file.
//For any third party dependencies, like jQuery, place them in the lib folder.
//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
requirejs.config({
    baseUrl: "/assets",
    // urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        "jquery": "vendor/jquery/dist/jquery",

        /* Foundation */
        'foundation': 'vendor/foundation/js/foundation',

        /* Others Scripts */
        'jquery.cookie': 'vendor/jquery.cookie/jquery.cookie',
        'fastclick': 'vendor/fastclick/lib/fastclick',
        "modernizr": "vendor/modernizr/modernizr",
        'placeholder': 'vendor/jquery-placeholder/jquery.placeholder',

    },
    shim: {
        /* Foundation */
        'foundation': {
            deps: [
            'jquery',
            'modernizr'
            ],
            exports: 'Foundation'
        },

        /* Vendor Scripts */
        'jquery.cookie': {
            deps: [
            'jquery'
            ]
        },
        'fastclick': {
            exports: 'FastClick'
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'placeholder': {
            exports: 'Placeholders'
        }
    },
    deps: [
    'js/main'
    ]
});
