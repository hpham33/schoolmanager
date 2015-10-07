'use strict';

// Statistic controller
angular.module('statistics').controller('ListStatisticController',
	['$log', '$q', '$rootScope', '$scope', '$state', '$filter', '$modal', 'Statistics', 'PaginationService', 'hpUtils',
		function ($log, $q, $rootScope, $scope, $state, $filter, $modal, Statistics, PaginationService, hpUtils) {
			var defaultFilterData = {
				dateFrom: hpUtils.firstDayOfCurrentMonth(),
				dateTo: hpUtils.lastDayOfCurrentMonth()
			};

			$scope.statistic = {
				totalAmountIn: 0,
				totalAmountOut: 0,
				balance: 0
			};

			$scope.gridConfig = {
				gridOptions: {
					useExternalSorting: false,
					enableGridMenu: false,
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
					data: [],
					importerDataAddCallback: function (grid, newObjects) {}
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
				var findPromise = $scope.gridConfig.executeSearch();
				var totalAmountPromise = $scope.getTotalAmount();
				return $q.all([findPromise, totalAmountPromise]);
			};

			$scope.getTotalAmount = function() {
				return Statistics.totalAmount($scope.gridConfig.searchParams).$promise.then(function (response) {
					$scope.statistic.totalAmountIn = response.totalAmountIn || 0;
					$scope.statistic.totalAmountOut = response.totalAmountOut || 0;
					$scope.statistic.balance = response.balance || 0;
				});
			};

			$scope.exportPDF = function () {
				var dd = {
					content: [
						'Bảng thống kê chi tiêu toàn trường',
						'Từ ngày ' + date2String($scope.gridConfig.searchParams.dateFrom) + ' đến ngày ' + date2String($scope.gridConfig.searchParams.dateTo),
						sprintf('Tổng thu: %s\nTổng chi: %s\nCòn lại: %s',
							$filter('currencyFilter')($scope.statistic.totalAmountIn),
							$filter('currencyFilter')($scope.statistic.totalAmountOut),
							$filter('currencyFilter')($scope.statistic.balance)),
						{
							style: 'tableExample',
							table: {
								headerRows: 1,
								body: [
									[{text: 'Học sinh', style: 'tableHeader'}, {
										text: 'Tổng thu',
										style: 'tableHeader'
									}, {text: 'Tổng chi', style: 'tableHeader'}, {
										text: 'Còn lại',
										style: 'tableHeader'
									}]

								]
							},
							layout: 'lightHorizontalLines'
						}
					]
				};

				_.forEach($scope.gridConfig.gridOptions.data, function (statistic) {
					dd.content[3].table.body.push(formatStatistic(statistic));
				});

				pdfMake.createPdf(dd).open();
			};

			function date2String(date) {
				return sprintf('%s.%s.%s',
					date.getDate(),
					date.getMonth() + 1,
					date.getFullYear());
			}

			function formatStatistic(statistic) {
				var result = [];
				result.push(statistic._id.name);

				var amountIn = $filter('currencyFilter')(statistic.totalAmountIn);
				result.push({ text: amountIn, alignment: 'right' });

				var amountOut = $filter('currencyFilter')(statistic.totalAmountOut);
				result.push({ text: amountOut, alignment: 'right' });

				var balance = $filter('currencyFilter')(statistic.balance);
				result.push({ text: balance, alighment: 'right' });

				return result;
			}

			$scope.getTotalAmount();
		}
	]);
