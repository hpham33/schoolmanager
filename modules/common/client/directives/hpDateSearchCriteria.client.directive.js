'use strict';

angular.module('common').directive('hpDateSearchCriteria',
	[function() {
		return {
			restrict: 'E',
			controllerAs: 'vm',
			bindToController: true,
			templateUrl: 'modules/common/client/directives/hpDateSearchCriteria.client.tpl.html',
			transclude: true,
			scope: {
				filterData: '=',
				search: '&'
			},
			controller: ['$log', 'hpUtils', '$rootScope', '$scope', function($log, hpUtils, $rootScope, $scope) {
				var vm = this;
                $rootScope.$on('dateChange', function(events, params) {
					if (params.fieldName === 'dateFrom') {
						vm.filterData.dateFrom = params.newDate;
					} else if (params.fieldName === 'dateTo') {
						vm.filterData.dateTo = params.newDate;
					}
				});

				vm.executeSearch = function() {
					if ($scope.mainForm && $scope.mainForm.$valid) {
						vm.search();
					}
				};

				vm.findCurrent = function() {
					vm.filterData.dateFrom = hpUtils.firstDayOfCurrentMonth();
					vm.filterData.dateTo =hpUtils.lastDayOfCurrentMonth();
					return vm.search();
				};

				vm.findLastMonth = function() {
					vm.filterData.dateFrom = hpUtils.firstDayOfLastMonth();
					vm.filterData.dateTo =hpUtils.lastDayOfLastMonth();
					return vm.search();
				};

				vm.findNextMonth = function() {
					vm.filterData.dateFrom = hpUtils.firstDayOfNextMonth();
					vm.filterData.dateTo =hpUtils.lastDayOfNextMonth();
					return vm.search();
				};

				vm.findCurrentYear = function() {
					vm.filterData.dateFrom = hpUtils.firstDayOfCurrentYear();
					vm.filterData.dateTo = hpUtils.lastDayOfCurrentYear();
					return vm.search();
				};
			}]
		};
	}]);
