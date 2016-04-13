define(
    'ui/routers/router-ui',
    [
        'app',
        'ui/views/start',
        'ui/views/sign-in',
        'ui/views/profile',
        'ui/views/set-password'
    ],
    function (App, Start, SignIn, Profile, SetPassword) {
        return App.Router.defaultRouter.extend({
            routes: {
                '(/)': 'start',
                'sign-in': 'signIn',
                'sign-in/:emailToken/:authToken': 'signIn',
                'profile': 'profile',
                'admin/profile/:userId': 'profile',
                'set-password': 'setPassword'
            },
            start: function () {
                /*App.createPage({
                    css: ['start'],
                    view: Start,
                    urlArguments: arguments
                });*/

                this.signIn.apply(arguments);
            },
            profile: function () {
                App.createPage({
                    css: ['profile'],
                    view: Profile,
                    urlArguments: arguments
                });
            },
            signIn: function() {
                App.createPage({
                    css: ['sign-in'],
                    view: SignIn,
                    urlArguments: arguments
                });
            },
            setPassword: function() {
                App.createPage({
                    css: ['set-password'],
                    view: SetPassword,
                    urlArguments: arguments
                });
            }
        });
    }
);