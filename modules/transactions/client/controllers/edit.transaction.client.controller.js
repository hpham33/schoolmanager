'use strict';

// Transactions controller
angular.module('transactions').controller('EditTransactionController',
    ['$scope', '$stateParams', '$modalInstance', 'Transactions', 'selectedTransaction', 'DetailsMixin',
	function($scope, $stateParams, $modalInstance, Transactions, selectedTransaction, DetailsMixin) {
        $scope.data = {
            __id: selectedTransaction && selectedTransaction._id || null,
            idField: 'transactionId',
            $modalInstance: $modalInstance
        };

        DetailsMixin.details({
            scope: $scope,
            resource: Transactions
        }).then(function(details) {
            $scope.details = details;
            $scope.details.data.created = $scope.details.data.created || new Date();
            $scope.details.data.student = $stateParams.studentId;
        });
	}
]);