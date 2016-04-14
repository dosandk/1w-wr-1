require.config({
    baseUrl: './',
    paths: {
        // Core sub-project
        core: 'js/core',
        app: 'js/core/app',
        config: 'js/core/config',
        jquery: 'js/core/libs/jquery-2.2.0',
        jqueryui: 'js/core/libs/jquery-ui/jquery-ui',
        validate: 'js/core/libs/jquery-plugins/validate/jquery.validate',
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
        'app',
        'ui/routers/router-ui'
    ],
    function(App, RouterUi) {
        $.when(function() {
            return $.ajax({
                url: 'https://qa.1worldonline.biz/1ws/json/AccountFindCurrent',
                xhrFields: {
                     withCredentials: true
                }
            });
        }).then(
            function(data) {
                if (!$.isEmptyObject(data)) {
                    App.auth.account = data;
                }

                new RouterUi();
            },
            function() {
                console.error('AccountFindCurrent error');
            }
        );
    
        return false;
    }
);
