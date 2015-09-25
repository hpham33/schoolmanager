'use strict';

// Students controller
angular.module('students').controller('ListStudentController',
    ['$log', '$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Students', 'PaginationService',
        function ($log, $scope, $stateParams, $location, $modal, Authentication, Students, PaginationService) {
            $scope.authentication = Authentication;
            $scope.model = {};
            $scope.filterData = {};
            var searchParams = {};

            $scope.studentGridOptions = {
                enableGridMenu: true,
                useExternalSorting: true,
                columnDefs: [
                    {
                        name: 'studentId',
                        displayName: 'Mã số học sinh',
                        enableHiding: false,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                                '<a ui-sref="detailStudent({ studentId: row.entity._id })">{{ row.entity.studentId }}</a>' +
                            '</div>'
                    },
                    {
                        name: 'name',
                        displayName: 'Tên học sinh',
                        enableHiding: false
                    },
                    {
                        name: 'referrer',
                        displayName: 'Điện thoại phụ huynh',
                        enableHiding: false
                    },
                    {
                        name: 'action',
                        displayName: '',
                        width: '10%',
                        enableHiding: false,
                        enableSorting: false,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                                '<button class="btn btn-default btn-xs" ng-if="grid.appScope.authentication.user._id === row.entity.user._id" ng-click="grid.appScope.openEditStudentDialog(row)" title="Sửa thông tin học sinh"><i class="glyphicon glyphicon-pencil"></i></button>' +
                                '&nbsp;&nbsp;<button class="btn btn-default btn-xs" ng-if="grid.appScope.authentication.user._id === row.entity.user._id" ng-click="grid.appScope.openDeleteStudentDialog(row)" title="Xóa thông tin học sinh"><i class="glyphicon glyphicon-remove"></i></button>' +
                            '</div>'
                    }
                ],
                data: [],
                importerDataAddCallback: function (grid, newObjects) {
                    Students.saveAll({}, newObjects).$promise.then(function(response) {
                        $log.info(response);
                        $scope.find();
                    });
                },
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.infiniteScroll.on.needLoadMoreData($scope, getDataDown);
                    gridApi.core.on.sortChanged($scope, $scope.sortChanged);
                }
            };

            $scope.openEditStudentDialog = function (row) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'modules/students/client/views/edit-student.client.view.html',
                    controller: 'EditStudentController',
                    resolve: {
                        selectedStudent: function () {
                            if (row) {
                                return row.entity;
                            }
                        }
                    }
                });

                modalInstance.result.then(function (newStudent) {
                    $scope.find();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.openDeleteStudentDialog = function (row) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'modules/students/client/views/delete-student.client.view.html',
                    controller: 'DeleteStudentController',
                    resolve: {
                        selectedStudent: function () {
                            if (row) {
                                return row.entity;
                            }
                        }
                    }
                });

                modalInstance.result.then(function (deletedStudent) {
                    $scope.find();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            // Find a list of Students
            $scope.find = function () {
                if ($scope.filterData.filterString) {
                    searchParams.filterString = $scope.filterData.filterString;
                } else {
                    delete searchParams.filterString;
                }

                PaginationService.page(Students.query, searchParams).then(function (page) {
                    $scope.page = page;
                    $scope.studentGridOptions.data = page.data;
                    $scope.gridApi.infiniteScroll.resetScroll(false, $scope.page.hasNext());
                });
            };

            $scope.sortChanged = function (grid, sortColumns) {
                if (sortColumns.length > 0) {
                    searchParams.orderBy = sortColumns[0].field;
                    if (sortColumns[0].sort.direction === 'desc') {
                        searchParams.orderBy = '-' + sortColumns[0].field;
                    }
                } else {
                    delete searchParams.orderBy;
                }
                $scope.find();
            };

            function getDataDown() {
                if ($scope.page.hasNext()) {
                    $scope.page.next().then(function (page) {
                        $scope.gridApi.infiniteScroll.saveScrollPercentage();
                        $scope.page = page;
                        $scope.studentGridOptions.data = $scope.studentGridOptions.data.concat(page.data);
                        $scope.gridApi.infiniteScroll.dataLoaded(false, $scope.page.hasNext());
                    });
                }
            }
        }
    ]);