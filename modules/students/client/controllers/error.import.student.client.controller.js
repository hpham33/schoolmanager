'use strict';

angular.module('students').controller('ErrorImportStudentController',
	['$scope', '$modalInstance', 'consoleMessage',
		function ($scope, $modalInstance, consoleMessage) {
			$scope.consoleMessage = consoleMessage;
		}]);
