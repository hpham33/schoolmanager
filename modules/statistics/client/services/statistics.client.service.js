'use strict';

//Statistics service used for communicating with the statistics REST endpoints
angular.module('statistics').factory('Statistics', ['$resource',
	function ($resource) {
		return $resource('api/statistics', {}, {
			totalAmount: {
				method: 'GET',
				url: 'api/statistics/totalAmount'
			}
		});
	}
]);
