'use strict';

// Students controller
angular.module('students').controller('StudentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Students',
  function ($scope, $stateParams, $location, Authentication, Students) {
    $scope.authentication = Authentication;

    // Create new Student
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'studentForm');

        return false;
      }

      // Create new Student object
      var student = new Students({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      student.$save(function (response) {
        $location.path('students/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Student
    $scope.remove = function (student) {
      if (student) {
        student.$remove();

        for (var i in $scope.students) {
          if ($scope.students[i] === student) {
            $scope.students.splice(i, 1);
          }
        }
      } else {
        $scope.student.$remove(function () {
          $location.path('students');
        });
      }
    };

    // Update existing Student
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'studentForm');

        return false;
      }

      var student = $scope.student;

      student.$update(function () {
        $location.path('students/' + student._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Students
    $scope.find = function () {
      $scope.students = Students.query();
    };

    // Find existing Student
    $scope.findOne = function () {
      $scope.student = Students.get({
        studentId: $stateParams.studentId
      });
    };
  }
]);
