'use strict';

angular.module('common')
	.provider('ValidationErrorMessages', [function() {
		var defaults = {
			required: 'This field is required'
		};
		function searchObj( obj ) {
			for(var key in obj) {
				if(obj[key] === true) {
					return key;
				}
			}
		}

		return {
			defaults: defaults,
			$get: function() {
				return {
					error: function(errorObj) {
						return defaults[searchObj(errorObj)] || searchObj(errorObj);
					}
				};
			}
		};
	}])
	.directive('hpValidationTooltip', ['$log', 'ValidationErrorMessages', '$log', function ($log, ValidationErrorMessages) {
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
							trigger: 'hover',
							html: false,
							title: ValidationErrorMessages.error(ngModel.$error)
						});
						element.tooltip('show');
					} else {
						element.tooltip('hide');
					}
				});

			}
		};
	}]);
