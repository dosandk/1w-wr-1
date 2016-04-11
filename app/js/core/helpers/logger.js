define(
    'core/helpers/logger',
    [
        'config'
    ],
    function(Config) {
        var console = window.console,
            isConsoleObjExist = typeof console === 'object';

        var methods = {
            1: 'log',
            2: 'warn',
            3: 'error'
        };

        var helper = function(level, message) {
            var consoleMethod = methods[level],
                isConsoleMethodExist = typeof console[consoleMethod] === 'function';

            if (Config.environment === 'development' && isConsoleObjExist && isConsoleMethodExist) {
                console[consoleMethod].call(console, message);
            }
        };

        for (var i in methods) {
            var method = methods[i];

            helper[method] = console[method].bind(console, arguments);
        }

        return helper;
    }
);