'use strict';

// Setting up route
angular.module('students').config(['$stateProvider',
	function ($stateProvider) {
		// Students state routing
		$stateProvider
			.state('students', {
				abstract: true,
				url: '/students',
				template: '<ui-view/>'
			})
			.state('students.list', {
				url: '',
				templateUrl: 'modules/students/client/views/list-students.client.view.html',
				controller: 'ListStudentController',
				data: {
					roles: ['user', 'admin']
				}
			})
			.state('students.details', {
				url: '/:studentId',
				templateUrl: 'modules/students/client/views/details-student.client.view.html',
				controller: 'DetailsStudentController',
				data: {
					roles: ['user', 'admin']
				},
				params: {
					dateFrom: null,
					dateTo: null
				}
			});
	}
]);
