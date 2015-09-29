'use strict';

angular.module('common')
	/**
	 * This directive is used as an attribute in a button to improve the usability.
	 * When button is clicked and $http service is calling,
	 * the button is disabled to prevent users from clicking multiple times on it,
	 * when service has finished calling, the button is enabled as normal.
	 * The value passed to this directive must be a function that return a promise
	 *
	 * Ex
	 * <button hp-click-and-wait="save()">Save</button>
	 */
	.directive('hpClickAndWait', ['$parse', '$log', function ($parse, $log) {
		return {
			restrict: 'A',
			compile: function (element, attr) {
				var fn = $parse(attr.hpClickAndWait);
				return function clickHandler(scope, element, attrs) {
					element.on('click', function (event) {
						attrs.$set('disabled', true);
						scope.$apply(function () {
							fn(scope, {$event: event}).finally(function () {
								attrs.$set('disabled', false);
							});
						});
					});
				};
			}
		};
	}]);
