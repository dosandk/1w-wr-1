define(
    'app',
    [
        'config',
        'core/views/default-view',
        'core/collections/default-collection',
        'core/models/default-model',
        'core/routers/default-router',
        'core/libs/backbone-plugins/backbone-mediator'
    ],
    function(Config, defaultView, defaultCollection, defaultModel, defaultRouter) {
        var App = {
            View: {
                defaultView: defaultView
            },
            Model: {
                defaultModel: defaultModel
            },
            Collection: {
                defaultCollection: defaultCollection
            },
            Router: {
                defaultRouter: defaultRouter
            }
        };

        App.config = Config;
        
        App.auth = {
            account: {}
        };
        
        App.navigate = function(route) {
            Backbone.history.navigate(route, {trigger: true});
        };

        App.createPage = function(params) {
            var urlArguments = params.urlArguments ? argumentsToArray(params.urlArguments) : null,
                View = params.view || App.View.defaultView,
                templatesArr = params.templates || [],
                cssArr = params.css || [];

            addCss(cssArr);

            getTemplates(templatesArr, function() {
                App.createView(View, {
                    urlArguments: urlArguments,
                    rawTemplates: argumentsToArray(arguments).join('')
                });
            });
        };

        App.createView = function(View, options) {
            var viewExtended = View;

            if (typeof options === 'object') viewExtended = View.extend(options);

            return new viewExtended();
        };

        function addCss(cssArr) {
            if (App.config.environment !== 'production') {
                injectCss(cssArr);
            }

            addCssScopes(cssArr);
        }

        function getTemplates(templatesArr, callback) {
            if (templatesArr.length) {
                var preparedTemplates = templatesArr.map(function(element) {
                    return 'text!templates/' + element + '.tpl';
                });

                require(preparedTemplates, function() {
                    if (typeof callback === 'function') callback.apply(this, arguments);
                });
            }
            else {
                if (typeof callback === 'function') callback();
            }
        }

        function injectCss(cssArr) {
            var head = document.getElementsByTagName('head')[0],
                cssTags = document.createDocumentFragment(),
                index = cssArr.length,
                cssTag;

            while (index--) {
                cssTag = document.createElement('link');
                cssTag.setAttribute('rel', 'stylesheet');
                cssTag.setAttribute('href', 'css/' + cssArr[index] + '.css');
                cssTags.appendChild(cssTag);
            }

            head.appendChild(cssTags);
        }

        function addCssScopes(cssArr) {
            var body = document.getElementsByTagName('body')[0],
                DEFAULT_CLASS_NAMES = 'default';

            body.className = '';
            body.className = DEFAULT_CLASS_NAMES + ' ' + cssArr.join(' ');
        }

        function argumentsToArray(args) {
            return Array.prototype.slice.call(args);
        }

        return App;
    }
);