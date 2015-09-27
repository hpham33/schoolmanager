'use strict';

// Configuring the Students module
angular.module('students').run(['Menus',
  function (Menus) {
    // Add the students dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Học sinh',
      state: 'students',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'students', {
      title: 'Danh sách học sinh',
      state: 'students.list'
    });
  }
]);
