'use strict';

angular.module('common').factory('hpUtils',
	['Authentication', function (Authentication) {
		function refineInputDate(inputDate) {
			var dateRegex = /^([0-9]{2})([0-9]{2})([0-9]{4})$/g;
			if (dateRegex.test(inputDate)) {
				return inputDate.replace(inputDate, '$1.$2.$3');
			}
			return inputDate;
		}

		function firstDayOfNextMonth() {
			var current = new Date();
			return new Date(current.getFullYear(), current.getMonth() + 1, 1);
		}

		function lastDayOfNextMonth() {
			var current = new Date();
			return new Date(current.getFullYear(), current.getMonth() + 2, 0);
		}

		function firstDayOfCurrentMonth() {
			var current = new Date();
			return new Date(current.getFullYear(), current.getMonth(), 1);
		}

		function lastDayOfCurrentMonth() {
			var current = new Date();
			return new Date(current.getFullYear(), current.getMonth() + 1, 0);
		}

		function firstDayOfLastMonth() {
			var current = new Date();
			return new Date(current.getFullYear(), current.getMonth() - 1, 1);
		}

		function lastDayOfLastMonth() {
			var current = new Date();
			return new Date(current.getFullYear(), current.getMonth(), 0);
		}

		function firstDayOfCurrentYear() {
			var current = new Date();
			return new Date(current.getFullYear(), 0, 1);
		}

		function lastDayOfCurrentYear() {
			var current = new Date();
			return new Date(current.getFullYear() + 1, 0, 0);
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

		/**
		 * Prepend vietnam country code +84 to phone number if it has exactly 10 digits
		 * @param phoneNumber
		 * @returns {string}
		 */
		function refinePhoneNumber(phoneNumber) {
			if (/^[0-9]{10}$/g.test(phoneNumber)) {
				return '+84' + phoneNumber.substr(1);
			} else {
				return phoneNumber;
			}
		}

        function objectToArray(object, propertiesArray) {
            var result = [];
            _.forEach(propertiesArray, function(property) {
                result.push(object[property].toString());
            });
            return result;
        }

		return {
			refineInputDate: refineInputDate,
			firstDayOfNextMonth: firstDayOfNextMonth,
			lastDayOfNextMonth: lastDayOfNextMonth,
			firstDayOfCurrentMonth: firstDayOfCurrentMonth,
			lastDayOfCurrentMonth: lastDayOfCurrentMonth,
			firstDayOfLastMonth: firstDayOfLastMonth,
			lastDayOfLastMonth: lastDayOfLastMonth,
			firstDayOfCurrentYear: firstDayOfCurrentYear,
			lastDayOfCurrentYear: lastDayOfCurrentYear,
			hasAuthorization: hasAuthorization,
			userHasRoles: userHasRoles,
			refinePhoneNumber: refinePhoneNumber,
            objectToArray: objectToArray
		};
	}]);
