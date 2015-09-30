'use strict';

// Students controller
angular.module('students').controller('ListStudentController',
	['$log', '$scope', '$modal', 'Authentication', 'Students',
		function ($log, $scope, $modal, Authentication, Students) {
			$scope.filterData = {};
			$scope.userHasPermission = Authentication.isAdmin() || Authentication.isUser();

			$scope.gridConfig = {
                gridOptions : {
                    //enableGridMenu: $scope.userHasPermission,
                    useExternalSorting: true,
                    columnDefs: [
                        {
                            name: 'studentId',
                            displayName: 'Mã số học sinh',
                            enableHiding: false,
                            cellTemplate:
                                '<div class="ui-grid-cell-contents">' +
                                    '<a ui-sref="students.details({ studentId: row.entity._id })" class="clickable" title="Xem chi tiết thu chi">{{ row.entity.studentId }}</a>' +
                                '</div>'
                        },
                        {
                            name: 'name',
                            displayName: 'Tên học sinh',
                            enableHiding: false,
                            cellTooltip: function (row) {
                                return row.entity.name;
                            }
                        },
                        {
                            name: 'referrer',
                            displayName: 'Điện thoại phụ huynh',
                            enableHiding: false
                        },
                        {
                            name: 'action',
                            displayName: '',
                            width: '100',
                            enableHiding: false,
                            enableSorting: false,
                            buttons: [{
                            type: 'EDIT',
                            title: 'Thay đổi thông tin học sinh',
                            execute: function(row) {
                                $scope.openEditStudentDialog(row);
                            }
                        }, {
                            type: 'DELETE',
                            title: 'Xóa học sinh',
                            execute: function(row) {
                                $scope.openDeleteStudentDialog(row);
                            }
                        }]
                        }
                    ],
                    importerDataAddCallback: function (grid, newObjects) {
                        Students.saveAll({}, newObjects).$promise.then(function (response) {
                            $log.info(response);
                            $scope.find();
                        });
                    },
                    data: []
                },
                resource: Students,
                searchParams: {}
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
				return $scope.gridConfig.executeSearch();
			};

			$scope.reset = function () {
                delete $scope.gridConfig.searchParams.filterString;
                return $scope.gridConfig.executeSearch();
			};
		}
	]);
