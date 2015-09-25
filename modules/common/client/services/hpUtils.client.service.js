'use strict';

angular.module('common').factory('hpUtils',
    [function() {
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

        return {
            refineInputDate: refineInputDate,
            firstDayOfCurrentMonth: firstDayOfCurrentMonth,
            lastDayOfCurrentMonth: lastDayOfCurrentMonth
        };
    }]);
