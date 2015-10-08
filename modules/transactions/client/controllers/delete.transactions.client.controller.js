'use strict';

// Transactions controller
angular.module('transactions').controller('DeleteTransactionController',
	['$scope', '$modalInstance', 'selectedTransaction',
		function ($scope, $modalInstance, selectedTransaction) {

			$scope.ok = function () {
				selectedTransaction.$remove(function (response) {
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
