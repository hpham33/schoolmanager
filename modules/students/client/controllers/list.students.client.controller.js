'use strict';

// Students controller
angular.module('students').controller('ListStudentController',
	['$log', '$scope', '$modal', 'Authentication', 'Students',
		function ($log, $scope, $modal, Authentication, Students) {
			$scope.filterData = {};
			$scope.userHasPermission = Authentication.isAdmin() || Authentication.isUser();

			$scope.gridConfig = {
				gridOptions: {
					enableGridMenu: $scope.userHasPermission,
					useExternalSorting: true,
					columnDefs: [
                        {
                            name: 'sequence',
                            displayName: 'STT',
                            enableHiding: false,
                            width: '50'
                        },
						{
							name: 'studentId',
							displayName: 'Mã số',
							enableHiding: false,
							cellTemplate: '<div class="ui-grid-cell-contents">' +
							'<a ui-sref="students.details({ studentId: row.entity._id })" class="clickable" title="Xem chi tiết thu chi">{{ row.entity.studentId }}</a>' +
							'</div>'
						},
						{
							name: 'name',
							displayName: 'Họ và tên',
							enableHiding: false,
							cellTooltip: function (row) {
								return row.entity.name;
							}
						},
						{
							name: 'referrer',
							displayName: 'Điện thoại',
							enableHiding: false
						},
						{
							name: 'address',
							visible: false
						},
						{
							name: 'birthday',
							visible: false
						},
						{
							name: 'gender',
							visible: false
						},
						{
							name: 'class',
							visible: false
						},
						{
							name: 'action',
							displayName: '',
							width: '100',
							enableHiding: false,
							enableSorting: false,
							buttons: [
								{
									type: 'EDIT',
									title: 'Thay đổi thông tin học sinh',
									execute: function (row) {
										$scope.openEditStudentDialog(row);
									},
									condition: function (row) {
										return Authentication.isAdmin() ||
											Authentication.user._id === row.entity.user._id;
									}
								},
								{
									type: 'DELETE',
									title: 'Xóa học sinh',
									execute: function (row) {
										$scope.openDeleteStudentDialog(row);
									},
									condition: function (row) {
										return Authentication.isAdmin() ||
											Authentication.user._id === row.entity.user._id;
									}
								}
							]
						}
					],
					importerErrorCallback: function (grid, errorKey, consoleMessage, context) {
						var modalInstance = $modal.open({
							animation: true,
							templateUrl: 'modules/students/client/views/error-import-student.client.view.html',
							controller: 'ErrorImportStudentController',
							resolve: {
								consoleMessage: function () {
									return consoleMessage;
								}
							}
						});

						modalInstance.result.then(function () {
							$scope.find();
						}, function () {
							$log.info('Modal dismissed at: ' + new Date());
						});
					},
					importerDataAddCallback: function (grid, newObjects) {
                        //$log.info(newObjects);
						$scope.gridConfig.showSpinner();
						Students.saveAll({}, newObjects).$promise.then(function (response) {
							$scope.find();
						}).finally(function () {
							$scope.gridConfig.removeSpinner();
						});
					},
					importerObjectCallback: function (grid, newObject) {
						if (newObject.birthday) {
							newObject.birthday = new Date(newObject.birthday);
							newObject.birthday.setHours(0);
							newObject.birthday.setMinutes(0);
							newObject.birthday.setSeconds(0);
							newObject.birthday.setMilliseconds(0);
						}
						if (newObject.gender) {
							switch (newObject.gender) {
								case 'nam':
								case 'Nam':
								case 'NAM':
									newObject.gender = 'male';
									break;
								case 'Nữ':
								case 'nữ':
								case 'NỮ':
									newObject.gender = 'female';
									break;
							}
						} else {
							delete newObject.gender;
						}
                        if (newObject.referrer) {
                            var referrerStr = newObject.referrer.toString();
                            if (referrerStr.length === 9 || referrerStr.length === 10) {
                                newObject.referrer = '0' + referrerStr;
                            }
                        }
						return newObject;
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
