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
        templateUrl: 'modules/students/client/views/list-students.client.view.html'
      })
      .state('students.create', {
        url: '/create',
        templateUrl: 'modules/students/client/views/create-student.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('students.view', {
        url: '/:studentId',
        templateUrl: 'modules/students/client/views/view-student.client.view.html'
      })
      .state('students.edit', {
        url: '/:studentId/edit',
        templateUrl: 'modules/students/client/views/edit-student.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
