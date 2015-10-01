'use strict';

angular.module('students').controller('DetailsStudentController',
	['$log', '$q', '$rootScope', '$scope', '$stateParams', '$location', '$modal', 'Authentication', 'PaginationService', 'Students', 'Transactions', 'DetailsMixin', 'hpUtils',
		function ($log, $q, $rootScope, $scope, $stateParams, $location, $modal, Authentication, PaginationService, Students, Transactions, DetailsMixin, hpUtils) {

			var defaultStatistic = {
				totalAmountIn: 0,
				totalAmountOut: 0,
				balance: 0
			};

			var defaultFilterData = {
				student: $stateParams.studentId,
				dateFrom: $stateParams.dateFrom || hpUtils.firstDayOfCurrentMonth(),
				dateTo: $stateParams.dateTo || hpUtils.lastDayOfCurrentMonth()
			};

			var userHasPermission = Authentication.isAdmin() || Authentication.isUser();

			$scope.statistic = _.clone(defaultStatistic);

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

			$scope.gridConfig = {
                gridOptions : {
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
                            width: '100',
                            enableHiding: false,
                            enableSorting: false,
                            buttons: [{
                                type: 'EDIT',
                                title: 'Thay đổi thông tin chi tiêu',
                                execute: function(row) {
                                    $scope.openEditTransactionDialog(row);
                                }
                            }, {
                                type: 'DELETE',
                                title: 'Xóa khoản chi tiêu',
                                execute: function(row) {
                                    $scope.openDeleteTransactionDialog(row);
                                }
                            }]
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
                            $scope.findTransaction();
                        });
                    }
                },
                resource: Transactions,
                searchParams: _.clone(defaultFilterData)
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
					$scope.findTransaction();
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
					$scope.findTransaction();
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
                var findPromise = $scope.gridConfig.executeSearch();
                var totalAmountPromise = getTotalAmount();
                return $q.all([findPromise, totalAmountPromise]);
			};

			function getTotalAmount() {
				return Transactions.totalAmount($scope.gridConfig.searchParams).$promise.then(function (response) {
					$scope.statistic.totalAmountIn = response.totalAmountIn || 0;
					$scope.statistic.totalAmountOut = response.totalAmountOut || 0;
					$scope.statistic.balance = response.balance || 0;
				});
			}

            getTotalAmount();
		}]);
