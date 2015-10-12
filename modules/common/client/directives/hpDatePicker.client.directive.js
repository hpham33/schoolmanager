'use strict';

angular.module('common').directive('hpDatePicker',
	[function () {
		return {
			//replace: true,
			restrict: 'E',
			controllerAs: 'vm',
			bindToController: true,
			templateUrl: 'modules/common/client/directives/hpDatePicker.client.tpl.html',
			scope: {
				model: '=',
				isRequired: '=',
				name: '@',
				onChange: '&'
			},
			controller: ['$log', '$scope', function ($log, $scope) {
				var vm = this;
				vm.name = vm.name || 'date';
				vm.status = {
					opened: false
				};

				vm.dateChange = function (date) {
					$scope.$broadcast('dateChange', {name: vm.name, newDate: date});
					if (vm.onChange) {
						vm.onChange();
					}
				};

				vm.open = function ($event) {
					if ($event) {
						$event.preventDefault();
						$event.stopPropagation(); // This is the magic
					}
					vm.status.opened = true;
				};
			}]
		};
	}]);
