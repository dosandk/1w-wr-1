define(
    'core/collections/default-collection',
    [
        'backbone',
        'core/models/default-model'
    ],
    function (Backbone, defaultModel) {
        return Backbone.Collection.extend({
            model: defaultModel
        });
    }
);