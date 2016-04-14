define(
    'ui/views/set-password',
    [
        'app',
        'text!templates/set-password.tpl'
    ],
    function(App, tpl) {
        return App.View.defaultView.extend({
            el: '#main',
            events: {
                'click .js-set-pass-submit': 'changePass'
            },
            selector: {
                pass: '.password',
                retypePass: '.retype-password'
            },
            initialize: function() {
                var self = this;
                
                $.when(self.requestUserStatus()).then(
                    function(data) {
                        var cintRegistrationStatus = data.status;
                        
                        if (cintRegistrationStatus === 'success' && cintRegistrationStatus === 'error') {
                            self.navigateToProfile();
                        }
                        else if (cintRegistrationStatus === 'none') {
                            alert('Sorry, you did not register for World Research');
                            App.navigate('sign-in');
                        }
                        else {
                            self.render();
                        }
                    },
                    function() {
                        App.navigate('sign-in');
                    }
                );
                
                
            },
            render: function() {
                var self = this;
                
                self.templates = self.prepareTpl(tpl);
                self.$el.html(_.template(self.templates['tplSetPassword']));
            },
            requestUserStatus: function() {
                return $.ajax({
                    url: App.config.URL_SERVER + 'CintGetCurrentStatus',
                    xhrFields: {
                         withCredentials: true
                    }
                });
            },
            cintSendRequest: function() {
                $.ajax({
                    url: App.config.URL_SERVER + 'CintSendRequest',
                    xhrFields: {
                         withCredentials: true
                    }
                })
                .error(function() {
                    console.error('CintSendRequest API error');
                });
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
            changePass: function() {
                var self = this,
                    pass = self.$(self.selector.pass).val(),
                    retypePass = self.$(self.selector.retypePass).val(),
                    resetPasswordToken = self.urlArguments[0],
                    account = App.auth.account;
                    
                if (pass === retypePass) {
                    $.when(self.requestPasswordChanging(pass, retypePass, resetPasswordToken)).then(
                        function(data) {
                            switch (data.code) {
                                case '00701':
                                    alert('Account with ID ' + account.id + ' does not exist.');
                                    break;
                                case '00101':
                                    alert('Password must not be empty.');
                                    break;
                                case '00102':
                                    alert('Passwords do not match.');
                                    break;
                                case '00730':
                                    alert('Empty or invalid token (t) presented.');
                                    break;
                                default:
                                    self.cintSendRequest();
                                    self.navigateToProfile();
                                    
                                return null;
                            }
                        },
                        function() {
                            alert('Something went wrong');
                        }
                    );
                }
                else {
                    alert('Passwords do not match.');
                }
            },
            requestPasswordChanging: function(pass, retypePass, resetPasswordToken) {
                return $.ajax({
                    url: App.config.URL_SERVER + 'AccountChangePasswordWithToken',
                    xhrFields: {
                         withCredentials: true
                    },
                    data: {
                        password: pass,
                        verifyPassword: retypePass,
                        resetPasswordToken: resetPasswordToken
                    }
                });
            }
        });
    }
);