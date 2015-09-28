'use strict';

// Students controller
angular.module('students').controller('ListStudentController',
	['$log', '$scope', '$modal', 'Authentication', 'Students', 'PaginationService',
		function ($log, $scope, $modal, Authentication, Students, PaginationService) {
			$scope.filterData = {};
			$scope.userHasPermission = Authentication.isAdmin() || Authentication.isUser();
			var searchParams = {};

			$scope.studentGridOptions = {
				enableGridMenu: $scope.userHasPermission,
				useExternalSorting: true,
				columnDefs: [
					{
						name: 'studentId',
						displayName: 'Mã số học sinh',
						enableHiding: false

					},
                    {
                        name: 'name',
                        displayName: 'Tên học sinh',
                        enableHiding: false,
                        cellTooltip: function (row, col) {
                            return row.entity.name;
                        }
                    },
					{
						name: 'referrer',
						displayName: 'Điện thoại phụ huynh',
						enableHiding: false
					}
				],
				importerDataAddCallback: function (grid, newObjects) {
					Students.saveAll({}, newObjects).$promise.then(function (response) {
						$log.info(response);
						$scope.find();
					});
				},
				onRegisterApi: function (gridApi) {
					$scope.gridApi = gridApi;
					gridApi.infiniteScroll.on.needLoadMoreData($scope, getDataDown);
					gridApi.core.on.sortChanged($scope, $scope.sortChanged);
				},
				data: []
			};

			if ($scope.userHasPermission) {
				$scope.studentGridOptions.columnDefs[0].cellTemplate =
					'<div class="ui-grid-cell-contents">' +
						'<a ui-sref="students.details({ studentId: row.entity._id })" class="clickable" title="Xem chi tiết thu chi">{{ row.entity.studentId }}</a>' +
					'</div>';
				$scope.studentGridOptions.columnDefs.push({
					name: 'action',
					displayName: '',
					width: '70',
					enableHiding: false,
					enableSorting: false,
					cellTemplate:
					'<div class="ui-grid-cell-contents">' +
						'<button class="btn btn-default btn-xs" ng-if="grid.appScope.currentUserCanEditStudent(row.entity)" ng-click="grid.appScope.openEditStudentDialog(row)" title="Sửa thông tin học sinh">' +
							'<i class="glyphicon glyphicon-pencil"></i>' +
						'</button>' +
						'&nbsp;&nbsp;' +
						'<button class="btn btn-default btn-xs" ng-if="grid.appScope.currentUserCanEditStudent(row.entity)" ng-click="grid.appScope.openDeleteStudentDialog(row)" title="Xóa thông tin học sinh">' +
							'<i class="glyphicon glyphicon-remove"></i>' +
						'</button>' +
					'</div>'
				});
			}

			$scope.currentUserCanEditStudent = function (student) {
				return Authentication.isAdmin() ||
					Authentication.user._id === student.user._id;
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

			$scope.reset = function () {
				$scope.filterData.filterString = '';
				delete searchParams.filterString;

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
