define(
    [
        'backbone'
    ],
    function (Backbone) {
        return Backbone.Router.extend({
            initialize: function() {
                Backbone.history.start()
            }
        });
    }
);