define(
    'ui/helpers/localization',
    function() {
        var helper = {};

        helper.monthsNames = {
            defaultProp: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
        };

        helper.get = function(property, locale) {
            var self = this,
                currentLocale = locale || 'defaultProp';

            return self[property][currentLocale];
        };

        return helper;
    }
);