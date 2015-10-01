'use strict';

// Statistic controller
angular.module('statistics').controller('ListStatisticController',
	['$log', '$rootScope', '$scope', '$state', '$modal', 'Statistics', 'PaginationService', 'hpUtils',
		function ($log, $rootScope, $scope, $state, $modal, Statistics, PaginationService, hpUtils) {
			var defaultFilterData = {
				dateFrom: hpUtils.firstDayOfCurrentMonth(),
				dateTo: hpUtils.lastDayOfCurrentMonth()
			};

			$scope.gridConfig = {
				gridOptions: {
					useExternalSorting: true,
					columnDefs: [
						{
							name: '_id',
							displayName: 'Học sinh',
							enableHiding: false,
							buttons: [{
								type: 'LINK',
								title: 'Xem chi tiết thu chi',
								text: function(row) {
									return row.entity._id.name;
								},
								execute: function (row) {
									$scope.goToDetailsStudent(row.entity._id._id);
								}
							}]
						},
						{
							name: 'totalAmountIn',
							displayName: 'Tổng thu',
							headerCellClass: 'text-right',
							enableHiding: false,
							cellTemplate:
							'<div class="ui-grid-cell-contents text-right text-warning" style="padding-right: 30px;">' +
								'<div>{{ row.entity.totalAmountIn | currencyFilter }}</div>' +
							'</div>'
						},
						{
							name: 'totalAmountOut',
							displayName: 'Tổng chi',
							headerCellClass: 'text-right',
							enableHiding: false,
							cellTemplate:
							'<div class="ui-grid-cell-contents text-right text-info" style="padding-right: 30px;">' +
								'<div>{{ row.entity.totalAmountOut | currencyFilter }}</div>' +
							'</div>'
						},
						{
							name: 'balance',
							displayName: 'Còn lại',
							headerCellClass: 'text-right',
							enableHiding: false,
							cellTemplate:
							'<div class="ui-grid-cell-contents text-right text-danger" style="padding-right: 30px;">' +
								'<div>{{ row.entity.balance | currencyFilter }}</div>' +
							'</div>'
						}
					],
					data: []
				},
				resource: Statistics,
				searchParams: _.clone(defaultFilterData)
			};

			$scope.goToDetailsStudent = function (id) {
				$state.go('students.details', {
					studentId: id,
					dateFrom: $scope.gridConfig.searchParams.dateFrom,
					dateTo: $scope.gridConfig.searchParams.dateTo
				});
			};

			// Find a list of Statistics
			$scope.find = function () {
				return $scope.gridConfig.executeSearch();
			};
		}
	]);
