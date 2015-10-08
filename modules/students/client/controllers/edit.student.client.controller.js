'use strict';

angular.module('students').controller('EditStudentController',
	['$scope', '$modalInstance', 'Students', 'selectedStudent', 'DetailsMixin',
		function ($scope, $modalInstance, Students, selectedStudent, DetailsMixin) {
			$scope.data = {
				__id: selectedStudent && selectedStudent._id || null,
				idField: 'studentId',
				$modalInstance: $modalInstance
			};

			DetailsMixin.details({
				scope: $scope,
				resource: Students
			}).then(function (details) {
				$scope.details = details;
			});
		}]);
