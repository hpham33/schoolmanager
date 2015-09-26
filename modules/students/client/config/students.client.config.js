'use strict';

// Configuring the Students module
angular.module('students').run(['Menus',
  function (Menus) {
    // Add the students dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Students',
      state: 'students',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'students', {
      title: 'List Students',
      state: 'students.list'
    });
  }
]);
