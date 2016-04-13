define(
    'ui/helpers/validate',
    [
        'app',
        'js/core/libs/jquery-plugins/validate/jquery.validate',
        'js/core/libs/jquery-plugins/validate/additional-methods'
    ],
    function(App) {


        $.fn.applyCharsCounters = function() {
            return function() {
                var form = this;
                form.find('input,textarea[maxlength]').keyup(function(e) {
                    var $inputField = $(e.currentTarget);
                    var charNumber = $inputField.val().replace(/(\r\n|\n|\r)/g,"  ").length;
                    var maxLength = $inputField.attr('maxLength');
                    var $labelForInput = form.find("[data-input-name= '" + $inputField.attr('name') + "'].charsCounter");
                    if ($labelForInput.length > 0) {
                        if (charNumber <= maxLength) {
                            //$labelForInput.html(maxLength - charNumber + " characters left");
                            $labelForInput.html(charNumber + '/' + maxLength);
                            $labelForInput.removeClass("warningLights");
                        }else {
                            $labelForInput.html(charNumber + '/' + maxLength);
                            $labelForInput.addClass("warningLights");
                        }
                    }
                }).trigger('keyup');

                form.find('input,textarea[maxlength]').bind('paste', function(e) {

                    var $inputField = $(e.currentTarget),
                        maxLength   = $inputField.attr('maxLength');

                    setTimeout(function(){
                        var charNumber = $inputField.val().replace(/(\r\n|\n|\r)/g,"  ").length,
                            crlfCount = $inputField.val().replace(/(\r\n|\n|\r)/g,"  ").length - $inputField.val().length
                        if (charNumber > maxLength) {
                            $inputField.val($inputField.val().substr(0, maxLength - crlfCount));
                        }
                    }, 0);

                })
            }
        }();


        $.fn.validate = function() {
            var _validate = $.fn.validate;
            return function() {
                this.applyCharsCounters();
                return _validate.apply(this, arguments);
            }
        }();

        return $;
    }
);