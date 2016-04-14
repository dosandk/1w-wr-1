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
            selector: {
                signinForm: '.signin-form',
                signinEmail: '.email',
                signinPswd: '.password'
            },
            initialize: function() {
                var self = this;

                if (self.urlArguments[0] && self.urlArguments[1]) {
                    self.sendEmailValidationRequest();
                }
                else {
                    self.checkCintParticipation();
                }
            },
            sendEmailValidationRequest: function() {
                var self = this,
                    emailToken = self.urlArguments[0],
                    authToken = self.urlArguments[1],
                    resetPassToken = self.urlArguments[2];
                    
                $.when(self.validateEmail(emailToken, authToken)).then(
                    function(data) {
                        if (data.code === '00203') {
                            App.navigate('set-password' + '/' + resetPassToken);
                        }
                        else {
                            self.render();
                        }
                    },
                    function() {
                        self.render();
                        console.error('CintValidateEmail API error');
                    }
                );
            },
            checkCintParticipation: function() {
                var self = this,
                    account = App.auth.account;

                $.when(self.requestUserStatus()).then(
                    function(data) {
                        var cintParticipationStatus = data.status;
                        
                        if (cintParticipationStatus === 'success' || cintParticipationStatus === 'error') {
                            self.navigateToProfile();
                        }
                        else {
                            self.render();
                        }
                    },
                    function() {
                        self.render();
                        console.error('CintGetCurrentStatus API error');
                    }
                );
            },
            render: function() {
                var self = this;
                
                self.templates = self.prepareTpl(tpl);
                self.$el.html(_.template(self.templates['tplSignIn']));

                self.validateSignInForm();
            },
            navigateToProfile: function() {
                var account = App.auth.account;
                
                if (account.admin) {
                    App.navigate('admin' + '/' + 'profile' + '/' + account.id);
                }
                else {
                    App.navigate('profile');
                }
            },
            requestUserStatus: function() {
                return $.ajax({
                    url: App.config.URL_SERVER + 'CintGetCurrentStatus',
                    xhrFields: {
                         withCredentials: true
                    }
                });
            },
            validateEmail: function(validateEmailToken, cintAuthToken) {
                return $.ajax({
                    url: App.config.URL_SERVER + 'CintValidateEmail',
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
                    url: App.config.DOMAIN_URL + '1ws/auth',
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

                                $.when(self.requestUserStatus()).then(
                                    function(data) {
                                        var cintParticipationStatus = data.status;
                                        
                                        if (cintParticipationStatus === 'success' || cintParticipationStatus === 'error') {
                                            self.navigateToProfile();
                                        }
                                        else {
                                            if (cintParticipationStatus === 'none') {
                                                alert('Sorry, you did not register for World Research');
                                            }
                                        }
                                    },
                                    function() {
                                        console.error('CintGetCurrentStatus API error');
                                    }
                                );
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