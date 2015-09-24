'use strict';

(function () {
  // Students Controller Spec
  describe('Students Controller Tests', function () {
    // Initialize global variables
    var StudentsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Students,
      mockStudent;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Students_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Students = _Students_;

      // create mock student
      mockStudent = new Students({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Student about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Students controller.
      StudentsController = $controller('StudentsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one student object fetched from XHR', inject(function (Students) {
      // Create a sample students array that includes the new student
      var sampleStudents = [mockStudent];

      // Set GET response
      $httpBackend.expectGET('api/students').respond(sampleStudents);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.students).toEqualData(sampleStudents);
    }));

    it('$scope.findOne() should create an array with one student object fetched from XHR using a studentId URL parameter', inject(function (Students) {
      // Set the URL parameter
      $stateParams.studentId = mockStudent._id;

      // Set GET response
      $httpBackend.expectGET(/api\/students\/([0-9a-fA-F]{24})$/).respond(mockStudent);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.student).toEqualData(mockStudent);
    }));

    describe('$scope.create()', function () {
      var sampleStudentPostData;

      beforeEach(function () {
        // Create a sample student object
        sampleStudentPostData = new Students({
          title: 'An Student about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Student about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Students) {
        // Set POST response
        $httpBackend.expectPOST('api/students', sampleStudentPostData).respond(mockStudent);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the student was created
        expect($location.path.calls.mostRecent().args[0]).toBe('students/' + mockStudent._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/students', sampleStudentPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock student in scope
        scope.student = mockStudent;
      });

      it('should update a valid student', inject(function (Students) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/students\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/students/' + mockStudent._id);
      }));

      it('should set scope.error to error response message', inject(function (Students) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/students\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(student)', function () {
      beforeEach(function () {
        // Create new students array and include the student
        scope.students = [mockStudent, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/students\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockStudent);
      });

      it('should send a DELETE request with a valid studentId and remove the student from the scope', inject(function (Students) {
        expect(scope.students.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.student = mockStudent;

        $httpBackend.expectDELETE(/api\/students\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to students', function () {
        expect($location.path).toHaveBeenCalledWith('students');
      });
    });
  });
}());
