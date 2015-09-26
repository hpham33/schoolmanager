'use strict';

angular.module('common').factory('hpUtils',
    ['Authentication', function(Authentication) {
        function refineInputDate(inputDate) {
            var dateRegex = /^([0-9]{2})([0-9]{2})([0-9]{4})$/g;
            if (dateRegex.test(inputDate)) {
                return inputDate.replace(inputDate, '$1.$2.$3');
            }
            return inputDate;
        }

        function firstDayOfCurrentMonth() {
            var current = new Date();
            return new Date(current.getFullYear(), current.getMonth(), 1);
        }

        function lastDayOfCurrentMonth() {
            var current = new Date();
            return new Date(current.getFullYear(), current.getMonth() + 1, 0);
        }

        function hasAuthorization(allowedRoles, userRoles) {
            var interSetRoles = _.difference(allowedRoles, userRoles);
            return interSetRoles.length < allowedRoles.length;
        }

        function userHasRoles(allowedRoles) {
            var userRoles = Authentication.user && Authentication.user.roles || [];
            var interSetRoles = _.difference(allowedRoles, userRoles);
            return interSetRoles.length < allowedRoles.length;
        }

        return {
            refineInputDate: refineInputDate,
            firstDayOfCurrentMonth: firstDayOfCurrentMonth,
            lastDayOfCurrentMonth: lastDayOfCurrentMonth,
            hasAuthorization: hasAuthorization,
            userHasRoles: userHasRoles
        };
    }]);
