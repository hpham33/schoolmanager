'use strict';

// Setting up route
angular.module('statistics').config(['$stateProvider',
    function ($stateProvider) {
        // Statistics state routing
        $stateProvider
            .state('statistics', {
                abstract: true,
                url: '/statistics',
                template: '<ui-view/>'
            })
            .state('statistics.list', {
                url: '',
                templateUrl: 'modules/statistics/client/views/list-statistics.client.view.html',
                controller: 'ListStatisticController',
                data: {
                    roles: ['user', 'admin']
                }
            });
    }
]);
