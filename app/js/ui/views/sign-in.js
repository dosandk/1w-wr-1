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
                var self = this,
                    cintRegistrationStatus,
                    account = App.auth.account,
                    urlArguments = self.urlArguments;
                    
                
                if (urlArguments[0] && urlArguments[1]) {
                    var emailToken = urlArguments[0],
                        authToken = urlArguments[1];
                        
                    self.validateEmail(emailToken, authToken);
                }
                
                $.when(self.requestUserStatus()).then(function(data) {
                    cintRegistrationStatus = data.status;
                    if (cintRegistrationStatus !== 'success') {
                        if (account.admin) {
                            App.navigate('admin' + '/' + 'profile' + '/' + account.id);
                        }
                        else {
                            App.navigate('profile');
                        }
                    }
                });
                
                
                self.render();
                self.validateSignInForm();
            },
            render: function() {
                var self = this;
                
                self.templates = self.prepareTpl(tpl);
                self.$el.html(_.template(self.templates['tplSignIn']));
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
                var self = this;
                
                $.ajax({
                    url: 'https://qa.1worldonline.biz/1ws/json/CintValidateEmail',
                    data: {
                        email: App.auth.account.email,
                        validateEmailToken: validateEmailToken,
                        cintAuthToken: cintAuthToken
                    },
                    success: function(data) {
                        if (data.code === '00203') {
                            App.navigate('set-password');
                        }
                    }
                });
            },
            authorize: function(options, callbackSuccess, callbackError) {
                return $.ajax({
                    url: 'https://qa.1worldonline.biz/1ws/auth',
                    dataType: 'json',
                    data: options,
                    method: 'post',
                    xhrFields: {
                         withCredentials: true
                    },
                    success: function(data) {
                        App.auth.account = data;
                        App.internalReferrer = undefined;
                        callbackSuccess(data);
                    },
                    error: function(XMLHttpRequest) {
                        if ('function' === typeof callbackError) {
                            callbackError(XMLHttpRequest);
                        }
                    }
                });
            },
            validateSignInForm: function() {
                var self = this;

                var validator = self.$(self.selector.signinForm).validate({
                    submitHandler: function() {
                        var signInEmailVal = self.$(self.selector.signinEmail).val();
                        var signInPswdVal = self.$(self.selector.signinPswd).val();

                        self.showLoader();
                        self.authorize(
                            {
                                username: signInEmailVal,
                                password: signInPswdVal,
                                rememberMe: true
                            },
                            function(data) {
                                var account = data;
                                if (account.admin) {
                                    App.navigate('admin' + '/' + 'profile' + '/' + account.id);
                                }
                                else {
                                    App.navigate('profile');
                                }
                            },
                            function(XMLHttpRequest) {
                                // abstract method
                            }
                        );
                    }
                });
            }
        });
    }
);