'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
	function ($window) {
		return {
			user: $window.user,
			isAdmin: function () {
				return _.contains($window.user.roles, 'admin');
			},
			isUser: function() {
				return _.contains($window.user.roles, 'user');
			}
		};
	}
]);
