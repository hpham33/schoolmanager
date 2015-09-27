'use strict';

//Students service used for communicating with the students REST endpoints
angular.module('transactions').factory('Transactions', ['$resource',
    function ($resource) {
        return $resource('api/transactions/:transactionId', {
            transactionId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            saveAll: {
                method: 'POST',
                isArray: true
            },
            totalAmount: {
                method: 'GET',
                url: 'api/transactions/totalAmount'
            }
        });
    }
]);