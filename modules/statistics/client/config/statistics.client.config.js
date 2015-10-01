'use strict';

// Configuring the Statistics module
angular.module('statistics').run(['Menus',
  function (Menus) {
    // Add the statistics dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Thống Kê',
      state: 'statistics',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'statistics', {
      title: 'Chi tiêu toàn trường',
      state: 'statistics.list'
    });
  }
]);
