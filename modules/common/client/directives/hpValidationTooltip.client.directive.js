'use strict';

angular.module('common')
	.provider('$hpValidationTooltip', [function() {
		var defaultMessages = {
			required: 'Nội dung này không nên để trống',
            date: 'Ngày chưa hợp lệ',
            email: 'Địa chỉ email chưa hợp lệ'
		};
		function getObjectKey(obj, val) {
            var returnKey;
            angular.forEach(obj, function(value, key) {
                if (obj[key] === val) {
                    returnKey = key;
                }
            });
			return returnKey;
		}

		return {
			defaultMessages: defaultMessages,
			$get: function() {
				return {
					getErrorMessage: function(errorObj) {
						return defaultMessages[getObjectKey(errorObj, true)] || getObjectKey(errorObj, true);
					}
				};
			}
		};
	}])
	.directive('hpValidationTooltip', ['$log', '$hpValidationTooltip', '$log', function ($log, $hpValidationTooltip) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attr, ngModel) {
				scope.$watch(function() {
					return JSON.stringify(ngModel.$error);
				}, function() {
					if (ngModel.$dirty && ngModel.$invalid) {
						element.tooltip({
							placement: 'top',
							trigger: 'hover focus',
							html: false,
							title: $hpValidationTooltip.getErrorMessage(ngModel.$error)
						});
						element.tooltip('show');
					} else {
						element.tooltip('hide');
						element.tooltip('destroy');
					}
				});
			}
		};
	}]);
