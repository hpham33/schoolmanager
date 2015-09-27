'use strict';

angular.module('common').directive('datepickerPopup',
    [function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1,
            link: function(scope, element, attrs, ngModel) {
                ngModel.$validators.date = function validator(modelValue, viewValue) {
                    var value = modelValue || viewValue;

                    if (!attrs.ngRequired && !value) {
                        return true;
                    }

                    if (angular.isNumber(value)) {
                        value = new Date(value);
                    }
                    if (!value) {
                        return true;
                    } else if (angular.isDate(value) && !isNaN(value)) {
                        value.setHours(0);
                        value.setMinutes(0);
                        value.setSeconds(0);
                        value.setMilliseconds(0);
                        return true;
                    } else if (angular.isString(value)) {
                        var date = new Date(value);
                        return !isNaN(date);
                    } else {
                        return false;
                    }
                };
            }
        };
    }]);
