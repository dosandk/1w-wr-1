require.config({
    baseUrl: './',
    paths: {
        // Core sub-project
        core: 'js/core',
        app: 'js/core/app',
        config: 'js/core/config',
        jquery: 'js/core/libs/jquery-2.2.0',
        jqueryui: 'js/core/libs/jquery-ui/jquery-ui',
        underscore: 'js/core/libs/underscore-1.6.0',
        backbone: 'js/core/libs/backbone-amd-1.1.0',
        text: 'js/core/libs/requirejs-plugins/text-2.0.12',

        // UI sub-project
        ui: 'js/ui',
        backgrid: 'js/ui/libs/backbone-plugins/backgrid'
    }
});

require(
    [
        'ui/routers/router-ui'
    ],
    function(RouterUi) {
        new RouterUi();

        return false;
    }
);
