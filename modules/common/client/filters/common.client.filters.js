'use strict';

//Setting up route
angular.module('common')
    .filter('currencyFilter',
    [function() {
        function addSeparator(input) {
            return input.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        return function (input) {
            if (!_.isUndefined(input) && !_.isNull(input)) {
                return addSeparator(input.toString()) + ' đ';
            }
        };
    }])
    .filter('amountFilter',
    [function() {
        function addSeparator(input) {
            return input.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }
        return function(entity, amountType) {
            if (amountType === 'in' && amountType === entity.type ||
                amountType === 'out' && amountType === entity.type) {
                return addSeparator(entity.amount.toString()) + ' đ';
            }
            return '';
        };
}]);