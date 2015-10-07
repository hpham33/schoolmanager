'use strict';

angular.module('students').controller('DetailsStudentController',
	['$log', '$q', '$rootScope', '$scope', '$stateParams', '$location', '$filter', '$modal', 'Authentication', 'PaginationService', 'Students', 'Transactions', 'DetailsMixin', 'hpUtils',
		function ($log, $q, $rootScope, $scope, $stateParams, $location, $filter, $modal, Authentication, PaginationService, Students, Transactions, DetailsMixin, hpUtils) {

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
                    useExternalSorting: true,
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
                                },
	                            condition: function(row) {
		                            return Authentication.isAdmin() ||
			                            Authentication.user._id === row.entity.user._id;
	                            }
                            }, {
                                type: 'DELETE',
                                title: 'Xóa khoản chi tiêu',
                                execute: function(row) {
                                    $scope.openDeleteTransactionDialog(row);
                                },
	                            condition: function(row) {
		                            return Authentication.isAdmin() ||
			                            Authentication.user._id === row.entity.user._id;
	                            }
                            }]
                        }
                    ],
                    data: [],
                    minRowsToShow: 6,
                    importerDataAddCallback: function (grid, newObjects) {
	                    $scope.gridConfig.showSpinner();
                        //$log.info(newObjects);
                        Transactions.saveAll({}, newObjects).$promise.then(function (response) {
                            $scope.findTransaction();
                        }).finally(function() {
	                        $scope.gridConfig.removeSpinner();
                        });
                    },
	                importerObjectCallback: function (grid, newObject) {
		                if (newObject.created) {
			                newObject.created = new Date(newObject.created);
			                newObject.created.setHours(0);
			                newObject.created.setMinutes(0);
			                newObject.created.setSeconds(0);
			                newObject.created.setMilliseconds(0);
		                }
		                if (newObject.amountIn) {
			                newObject.amount = newObject.amountIn;
			                newObject.type = 'in';
		                }
		                if (newObject.amountOut) {
			                newObject.amount = newObject.amountOut;
			                newObject.type = 'out';
		                }
		                delete newObject.amountIn;
		                delete newObject.amountOut;
		                newObject.student = $stateParams.studentId;

		                return newObject;
	                }
                },
                resource: Transactions,
                searchParams: _.clone(defaultFilterData)
            };

			$scope.currentUserCanEditStudent = function () {
				return Authentication.isAdmin() ||
					($scope.details &&
					$scope.details.data &&
					$scope.details.data.user._id === Authentication.user._id);
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

			$scope.exportPDF = function () {
				var searchParams = _.clone($scope.gridConfig.searchParams);
				searchParams.pageSize = 0;
				PaginationService.page(Transactions.query, searchParams)
					.then(function (page) {
						var dd = {
							content: [
								'Chi tiết thu chi học sinh ' + $scope.details.data.name,
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
											[{text: 'Ngày', style: 'tableHeader'}, {
												text: 'Thu',
												style: 'tableHeader'
											}, {text: 'Chi', style: 'tableHeader'}, {
												text: 'Ghi chú',
												style: 'tableHeader'
											}]

										]
									},
									layout: 'lightHorizontalLines'
								}
							]
						};

						_.forEach(page.data, function (transaction) {
							dd.content[3].table.body.push(formatTransaction(transaction));
						});

						pdfMake.createPdf(dd).open();
					});
			};

			function getTotalAmount() {
				return Transactions.totalAmount($scope.gridConfig.searchParams).$promise.then(function (response) {
					$scope.statistic.totalAmountIn = response.totalAmountIn || 0;
					$scope.statistic.totalAmountOut = response.totalAmountOut || 0;
					$scope.statistic.balance = response.balance || 0;
				});
			}

            function formatTransaction(transaction) {
                var result = [];
	            var createdDate = new Date(transaction.created);
                var createdStr = sprintf('%s.%s.%s',
	                createdDate.getDate(),
	                createdDate.getMonth() + 1,
	                createdDate.getFullYear());
                result.push(createdStr);

                var amountIn = $filter('amountFilter')(transaction, 'in');
                result.push({ text: amountIn, alignment: 'right' });

	            var amountOut = $filter('amountFilter')(transaction, 'out');
	            result.push({ text: amountOut, alignment: 'right' });

                result.push(transaction.description);
                return result;
            }

			function date2String(date) {
				return sprintf('%s.%s.%s',
					date.getDate(),
					date.getMonth() + 1,
					date.getFullYear());
			}

            getTotalAmount();
		}]);
