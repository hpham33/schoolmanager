'use strict';

angular.module('common').config(
	['datepickerConfig', 'datepickerPopupConfig',
	function(datepickerConfig, datepickerPopupConfig) {

		datepickerConfig.startingDay = 0;
		datepickerConfig.showWeeks = false;

		datepickerPopupConfig.showButtonBar = false;
		datepickerPopupConfig.datepickerPopup = 'dd.MM.yyyy';
}]);
