'use strict';

describe('Students E2E Tests:', function () {
  describe('Test students page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/students');
      expect(element.all(by.repeater('student in students')).count()).toEqual(0);
    });
  });
});
