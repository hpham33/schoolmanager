'use strict';

angular.module('students').controller('SuccessImportStudentController',
    ['$scope', '$modalInstance', 'totalCreated',
        function ($scope, $modalInstance, totalCreated) {
            $scope.totalCreated = totalCreated;
        }]);