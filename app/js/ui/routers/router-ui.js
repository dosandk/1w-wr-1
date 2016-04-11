define(
    'ui/routers/router-ui',
    [
        'app',
        'ui/views/test'
    ],
    function (App, Test) {
        return App.Router.defaultRouter.extend({
            routes: {
                '(/)': 'test'
            },
            test: function () {
                App.createPage({
                    css: ['test'],
                    view: Test,
                    urlArguments: arguments
                });
            }
        });
    }
);
