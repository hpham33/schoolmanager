'use strict';

angular.module('students').controller('DetailsStudentController',
	['$log', '$rootScope', '$scope', '$stateParams', '$modal', 'Authentication', 'PaginationService', 'Students', 'Transactions', 'DetailsMixin', 'hpUtils',
		function ($log, $rootScope, $scope, $stateParams, $modal, Authentication, PaginationService, Students, Transactions, DetailsMixin, hpUtils) {

			var defaultStatistic = {
				totalAmountIn: 0,
				totalAmountOut: 0,
				balance: 0
			};

			var defaultFilterData = {
				student: $stateParams.studentId,
				dateFrom: hpUtils.firstDayOfCurrentMonth(),
				dateTo: hpUtils.lastDayOfCurrentMonth()
			};

			var userHasPermission = Authentication.isAdmin() || Authentication.isUser();

			$scope.statistic = _.clone(defaultStatistic);
			$scope.filterData = _.clone(defaultFilterData);

			$scope.data = {
				__id: $stateParams.studentId,
				idField: 'studentId'
			};

			DetailsMixin.details({
				scope: $scope,
				resource: Students
			}).then(function (details) {
				$scope.details = details;
			});

			$scope.transactionGridOptions = {
				enableGridMenu: userHasPermission,
				columnDefs: [
					{
						name: 'created',
						displayName: 'Ngày',
						cellFilter: 'date:\'dd.MM.yyyy\'',
                        width: '80',
						enableHiding: false
					},
					{
						name: 'amountIn',
						displayName: 'Thu',
						headerCellClass: 'text-right',
						enableHiding: false,
						enableSorting: false,
						cellTemplate:
							'<div class="ui-grid-cell-contents text-right text-warning" style="padding-right: 30px;">' +
								'<div>{{ row.entity | amountFilter:\'in\' }}</div>' +
							'</div>'
					},
					{
						name: 'amountOut',
						displayName: 'Chi',
						headerCellClass: 'text-right',
						enableHiding: false,
						enableSorting: false,
						cellTemplate:
							'<div class="ui-grid-cell-contents text-right text-info" style="padding-right: 30px;">' +
								'<div>{{ row.entity | amountFilter:\'out\' }}</div>' +
							'</div>'
					},
					{
						name: 'description',
						displayName: 'Ghi chú',
						width: '40%',
						enableHiding: false,
						enableSorting: false
					},
					{
						name: 'action',
						displayName: '',
						width: '70',
						enableHiding: false,
						enableSorting: false,
						cellTemplate:
						'<div class="ui-grid-cell-contents">' +
							'<button class="btn btn-default btn-xs" ng-if="grid.appScope.currentUserCanEditTransaction(row.entity)" ng-click="grid.appScope.openEditTransactionDialog(row)" title="Sửa thông tin chi tiêu">' +
								'<i class="glyphicon glyphicon-pencil"></i>' +
							'</button>' +
							'&nbsp;&nbsp;' +
							'<button class="btn btn-default btn-xs" ng-if="grid.appScope.currentUserCanEditTransaction(row.entity)" ng-click="grid.appScope.openDeleteTransactionDialog(row)" title="Xóa khoản chi tiêu">' +
								'<i class="glyphicon glyphicon-remove"></i>' +
							'</button>' +
						'</div>'
					}
				],
				data: [],
				minRowsToShow: 6,
				importerDataAddCallback: function (grid, newObjects) {
					//$log.info(newObjects);
					var formattedObjects = formatImportedObjects(newObjects);
					//$log.info(formattedObjects);
					Transactions.saveAll({}, formattedObjects).$promise.then(function (response) {
						$log.info(response);
						$scope.init();
					});
				},
				onRegisterApi: function (gridApi) {
					$scope.gridApi = gridApi;
					gridApi.infiniteScroll.on.needLoadMoreData($scope, getDataDown);
				}
			};

			function formatImportedObjects(objects) {
				return _.map(objects, function (object) {
					if (object.created) {
						var createdDate = new Date(Date.parse(object.created));
						createdDate.setHours(0);
						createdDate.setMinutes(0);
						createdDate.setSeconds(0);
						createdDate.setMilliseconds(0);
						object.created = createdDate;
					}
					if (object.amountIn) {
						object.amount = object.amountIn;
						object.type = 'in';
					}
					if (object.amountOut) {
						object.amount = object.amountOut;
						object.type = 'out';
					}
					delete object.amountIn;
					delete object.amountOut;
					object.student = $stateParams.studentId;

					return object;
				});
			}

			function getDataDown() {
				if ($scope.page.hasNext()) {
					$scope.page.next().then(function (page) {
						$scope.gridApi.infiniteScroll.saveScrollPercentage();
						$scope.page = page;
						$scope.transactionGridOptions.data = $scope.transactionGridOptions.data.concat(page.data);
						$scope.gridApi.infiniteScroll.dataLoaded(false, $scope.page.hasNext());
					});
				}
			}

			$scope.currentUserCanEditStudent = function () {
				return Authentication.isAdmin() ||
					($scope.details &&
					$scope.details.data &&
					$scope.details.data.user._id === Authentication.user._id);
			};

			$scope.currentUserCanEditTransaction = function (transaction) {
				return Authentication.isAdmin() ||
					Authentication.user._id === transaction.user._id;
			};

			$scope.openEditTransactionDialog = function (row) {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'modules/transactions/client/views/edit-transaction.client.view.html',
					controller: 'EditTransactionController',
					resolve: {
						selectedTransaction: function () {
							if (row) {
								return row.entity;
							}
						}
					}
				});

				modalInstance.result.then(function (newTransaction) {
					$scope.init();
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};

			$scope.openDeleteTransactionDialog = function (row) {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'modules/transactions/client/views/delete-transaction.client.view.html',
					controller: 'DeleteTransactionController',
					resolve: {
						selectedTransaction: function () {
							if (row) {
								return row.entity;
							}
						}
					}
				});

				modalInstance.result.then(function (newTransaction) {
					$scope.init();
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};

			$scope.openEditStudentDialog = function () {
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'modules/students/client/views/edit-student.client.view.html',
					controller: 'EditStudentController',
					resolve: {
						selectedStudent: function () {
							return $scope.details.data;
						}
					}
				});

				modalInstance.result.then(function (newStudent) {
					$scope.details.data = newStudent;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};

			$scope.findTransaction = function () {
				return PaginationService.page(Transactions.query, $scope.filterData).then(function (page) {
					$scope.page = page;
					$scope.transactionGridOptions.data = page.data;
					$scope.gridApi.infiniteScroll.resetScroll(false, $scope.page.hasNext());
				});
			};

			$scope.getTotalAmount = function () {
				return Transactions.totalAmount($scope.filterData).$promise.then(function (response) {
					$scope.statistic.totalAmountIn = response.totalAmountIn || 0;
					$scope.statistic.totalAmountOut = response.totalAmountOut || 0;
					$scope.statistic.balance = response.balance || 0;
				});
			};

			$scope.find = function () {
				$scope.init();
			};

			$scope.reset = function () {
				$scope.filterData = _.clone(defaultFilterData);
				$scope.init();
			};

			$scope.findNextMonth = function() {
				$scope.filterData.dateFrom = hpUtils.firstDayOfNextMonth();
				$scope.filterData.DateTo =hpUtils.lastDayOfNextMonth();
				$scope.find();
			};

			$scope.findLastMonth = function() {
				$scope.filterData.dateFrom = hpUtils.firstDayOfLastMonth();
				$scope.filterData.DateTo =hpUtils.lastDayOfLastMonth();
				$scope.find();
			};

			$scope.findCurrentYear = function() {
				$scope.filterData.dateFrom = hpUtils.firstDayOfCurrentYear();
				$scope.filterData.dateTo = hpUtils.lastDayOfCurrentYear();
				$scope.find();
			};

			$scope.init = function () {
				$scope.findTransaction();
				$scope.getTotalAmount();
			};

			$scope.init();
		}]);
