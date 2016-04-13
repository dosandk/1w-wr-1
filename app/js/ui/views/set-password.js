define(
    'ui/views/set-password',
    [
        'app',
        'text!templates/set-password.tpl'
    ],
    function(App, tpl) {
        return App.View.defaultView.extend({
            el: '#main',
            initialize: function() {
                var self = this;
                
                self.render();
            },
            render: function() {
                var self = this;
                
                self.templates = self.prepareTpl(tpl);
                self.$el.html(_.template(self.templates['tplSetPassword']));
            }
        });
    }
);