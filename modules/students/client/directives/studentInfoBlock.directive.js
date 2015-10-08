'use strict';

angular.module('students').directive('studentInfoBlock',
	[function () {
		return {
			restrict: 'E',
			templateUrl: 'modules/students/client/directives/studentInfoBlock.tpl.html',
			scope: {
				data: '=modelData'
			}
		};
	}]);
