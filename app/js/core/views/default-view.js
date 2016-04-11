define(
    'core/views/default-view',
    [
        'backbone'
    ],
    function(Backbone) {
        return Backbone.View.extend({
            prepareTpl: function(tpl) {
                var re = /<tpl[\s\t]+id=\"((?!\")\w+)\"[\s\t]*>(((?!<\/tpl).)*)<\/tpl>/g,
                    templateCollection = {};

                tpl.replace(/(\r\n|\n|\r)/gm, '').replace(re, function (matchStr, id, template) {
                    templateCollection[id] = template;
                });

                return templateCollection;
            },
            showLoader: function () {
                $('#main-loader').removeClass('hide');
            },
            hideLoader: function () {
                $('#main-loader').addClass('hide');
            },
            superMethod: function() {
                console.error('parent superMethod');
            }
        });
    }
);