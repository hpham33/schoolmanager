'use strict';

// Students controller
angular.module('statistics').controller('ListStatisticController',
    ['$log', '$rootScope', '$scope', '$modal', 'Statistics', 'PaginationService', 'hpUtils',
        function ($log, $rootScope, $scope, $modal, Statistics, PaginationService, hpUtils) {
            var defaultFilterData = {
                dateFrom: hpUtils.firstDayOfCurrentMonth(),
                dateTo: hpUtils.lastDayOfCurrentMonth()
            };

            $scope.filterData = _.clone(defaultFilterData);

            $scope.statisticGridOptions = {
                useExternalSorting: true,
                columnDefs: [
                    {
                        name: '_id',
                        displayName: 'Học sinh',
                        enableHiding: false,
                        cellTemplate:
                        '<div class="ui-grid-cell-contents">' +
                            '<a ui-sref="students.details({ studentId: row.entity._id._id })" class="clickable" title="Xem chi tiết thu chi">{{ row.entity._id.name }}</a>' +
                        '</div>'

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
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.infiniteScroll.on.needLoadMoreData($scope, getDataDown);
                    gridApi.core.on.sortChanged($scope, $scope.sortChanged);
                },
                data: []
            };

            // Find a list of Statistics
            $scope.find = function (invalid) {
                if (invalid) {
                    $rootScope.$broadcast('show-errors-check-validity', 'mainForm');
                    return;
                }

                PaginationService.page(Statistics.query, $scope.filterData).then(function (page) {
                    $scope.page = page;
                    $scope.statisticGridOptions.data = page.data;
                    $scope.gridApi.infiniteScroll.resetScroll(false, $scope.page.hasNext());
                });
            };

            $scope.reset = function() {
                $scope.filterData = _.clone(defaultFilterData);
                $scope.find();
            };

            $scope.sortChanged = function (grid, sortColumns) {
                if (sortColumns.length > 0) {
                    $scope.filterData.orderBy = sortColumns[0].field;
                    if (sortColumns[0].sort.direction === 'desc') {
                        $scope.filterData.orderBy = '-' + sortColumns[0].field;
                    }
                } else {
                    delete $scope.filterData.orderBy;
                }
                $scope.find();
            };

            function getDataDown() {
                if ($scope.page.hasNext()) {
                    $scope.page.next().then(function (page) {
                        $scope.gridApi.infiniteScroll.saveScrollPercentage();
                        $scope.page = page;
                        $scope.statisticGridOptions.data = $scope.statisticGridOptions.data.concat(page.data);
                        $scope.gridApi.infiniteScroll.dataLoaded(false, $scope.page.hasNext());
                    });
                }
            }
        }
    ]);