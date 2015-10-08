'use strict';

// Transactions controller
angular.module('students').controller('DeleteStudentController',
	['$scope', '$modalInstance', 'selectedStudent',
		function ($scope, $modalInstance, selectedStudent) {

			$scope.ok = function () {
				selectedStudent.$remove(function (response) {
					$modalInstance.close(response);
				}, function (errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			};

			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};
		}
	]);
