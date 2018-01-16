SystemJS.import('bootstrap').then(
  function (bootstrap) {

    SystemJS.import('ga').then(
      function (ga) {
        ga('create', 'UA-3614475-10', 'auto');
        ga('send', 'pageview');
        console.log('analytics is loaded');
      }
    );

    console.log('hello!');
  }
);