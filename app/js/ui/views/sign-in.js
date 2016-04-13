define(
    'ui/views/sign-in',
    [
        'app',
        'text!templates/sign-in.tpl',
        'jqueryui'
    ],
    function(App, tpl) {
        return App.View.defaultView.extend({
            el: '#main',
            childs: {},
            selector: {
                signinForm: '.signin-form',
                signinEmail: '.email',
                signinPswd: '.password'
            },
            initialize: function() {
                var self = this;

                if (self.urlArguments[0] && self.urlArguments[1]) {
                    self.method1();
                }
                else {
                    self.method2();
                }
            },
            method1: function() {
                var self = this,
                    emailToken = self.urlArguments[0],
                    authToken = self.urlArguments[1];

                $.when(self.validateEmail(emailToken, authToken)).then(
                    function(data) {
                        if (data.code === '00203') {
                            App.navigate('set-password');
                        }
                        else {
                            self.render();
                        }
                    },
                    function() {
                        // TODO: question?
                        console.error('error');
                    }
                );
            },
            method2: function() {
                var self = this;
                var account = App.auth.account;

                $.when(self.requestUserStatus()).then(
                    function(data) {
                        if (data.status === 'success') {
                            if (account.admin) {
                                App.navigate('admin' + '/' + 'profile' + '/' + account.id);
                            }
                            else {
                                App.navigate('profile');
                            }
                        }
                        else {
                            // TODO: question?
                            self.render();
                        }
                    },
                    function() {
                        self.render();
                        console.error('error');
                    }
                );
            },
            render: function() {
                var self = this;
                
                self.templates = self.prepareTpl(tpl);
                self.$el.html(_.template(self.templates['tplSignIn']));

                self.validateSignInForm();
            },
            requestUserStatus: function() {
                return $.ajax({
                    url: 'https://qa.1worldonline.biz/1ws/json/CintGetCurrentStatus',
                    xhrFields: {
                         withCredentials: true
                    }
                });
            },
            validateEmail: function(validateEmailToken, cintAuthToken) {
                return $.ajax({
                    url: 'https://qa.1worldonline.biz/1ws/json/CintValidateEmail',
                    method: 'post',
                    data: {
                        email: App.auth.account.email,
                        validateEmailToken: validateEmailToken,
                        cintAuthToken: cintAuthToken
                    }
                });
            },
            authorize: function(options) {
                return $.ajax({
                    url: 'https://qa.1worldonline.biz/1ws/auth',
                    dataType: 'json',
                    data: options,
                    method: 'post',
                    xhrFields: {
                         withCredentials: true
                    }
                });
            },
            validateSignInForm: function() {
                var self = this;

                self.$(self.selector.signinForm).validate({
                    submitHandler: function() {
                        var signInEmailVal = self.$(self.selector.signinEmail).val();
                        var signInPswdVal = self.$(self.selector.signinPswd).val();
                        var sendData = {
                            username: signInEmailVal,
                            password: signInPswdVal,
                            rememberMe: true
                        };

                        self.showLoader();

                        $.when(self.authorize(sendData)).then(
                            function(account) {
                                App.auth.account = account;

                                if (account.admin) {
                                    App.navigate('admin' + '/' + 'profile' + '/' + account.id);
                                }
                                else {
                                    App.navigate('profile');
                                }
                            },
                            function(XMLHttpRequest) {
                                // abstract method
                                self.hideLoader();
                            }
                        );
                    }
                });
            }
        });
    }
);