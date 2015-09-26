'use strict';

angular.module('students').controller('DetailsStudentController',
    ['$log', '$scope', '$stateParams', '$modal', 'PaginationService', 'Students', 'Transactions', 'DetailsMixin', 'hpUtils',
        function ($log, $scope, $stateParams, $modal, PaginationService, Students, Transactions, DetailsMixin, hpUtils) {

            $scope.statistic = {};
            $scope.filterData = {
                student: $stateParams.studentId,
                dateFrom: hpUtils.firstDayOfCurrentMonth().toISOString(),
                dateTo: hpUtils.lastDayOfCurrentMonth().toISOString()
            };
            var userHasRoles = hpUtils.userHasRoles(['admin', 'user']);

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
                enableGridMenu: userHasRoles,
                columnDefs: [
                    {
                        name: 'created',
                        displayName: 'Ngày',
                        cellFilter: 'date:\'dd.MM.yyyy\'',
                        enableHiding: false
                    },
                    {
                        name: 'amountIn',
                        displayName: 'Khoản thu',
                        headerCellClass: 'text-right',
                        enableHiding: false,
                        enableSorting: false,
                        cellTemplate: '<div class="ui-grid-cell-contents text-right text-warning" style="padding-right: 30px;">' +
                        '<div>{{ row.entity | amountFilter:\'in\' }}</div>' +
                        '</div>'
                    },
                    {
                        name: 'amountOut',
                        displayName: 'Khoản chi',
                        headerCellClass: 'text-right',
                        enableHiding: false,
                        enableSorting: false,
                        cellTemplate: '<div class="ui-grid-cell-contents text-right text-info" style="padding-right: 30px;">' +
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
                        width: '10%',
                        enableHiding: false,
                        enableSorting: false,
                        cellTemplate: '<div class="ui-grid-cell-contents">' +
                        '<button class="btn btn-default btn-xs" data-ng-click="grid.appScope.openEditTransactionDialog(row)" tooltip="Sửa thông tin chi tiêu" tooltip-placement="bottom" tooltip-trigger="mouseenter">' +
                        '<i class="glyphicon glyphicon-pencil"></i>' +
                        '</button>' +
                        '&nbsp;&nbsp;<button class="btn btn-default btn-xs" data-ng-click="grid.appScope.openDeleteTransactionDialog(row)" tooltip="Xóa khoản chi tiêu" tooltip-placement="bottom" tooltip-trigger="mouseenter"><i class="glyphicon glyphicon-remove"></i></button>' +
                        '</div>'
                    }
                ],
                data: [],
                minRowsToShow: 6,
                importerDataAddCallback: function (grid, newObjects) {
                    Transactions.saveAll($scope.filterData, newObjects).$promise.then(function(response) {
                        $log.info(response);
                        $scope.init();
                    });
                },
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.infiniteScroll.on.needLoadMoreData($scope, getDataDown);
                }
            };

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
                    templateUrl: 'modules/transactions/views/delete-transaction.client.view.html',
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

                PaginationService.page(Transactions.query, $scope.filterData).then(function (page) {
                    $scope.page = page;
                    $scope.transactionGridOptions.data = page.data;
                    $scope.gridApi.infiniteScroll.resetScroll(false, $scope.page.hasNext());
                });
            };

            $scope.getTotalAmount = function () {
                Transactions.totalAmount($scope.filterData).$promise.then(function (response) {
                    $log.info(response);
                    $scope.statistic = response[0];
                });
            };

            $scope.init = function () {
                $scope.findTransaction();
                $scope.getTotalAmount();
            };

            $scope.init();
        }]);