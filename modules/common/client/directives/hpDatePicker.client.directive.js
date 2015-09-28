'use strict';

angular.module('common').directive('hpDatePicker',
[function() {
    return {
        //replace: true,
        restrict: 'E',
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'modules/common/client/directives/hpDatePicker.client.tpl.html',
        scope: {
            model: '=',
            isRequired: '=',
            name: '@'
        },
        controller: [function() {
            var vm = this;
            vm.name = vm.name || 'date';
            vm.status = {
                opened: false
            };

            vm.open = function($event) {
                if ($event) {
                    $event.preventDefault();
                    $event.stopPropagation(); // This is the magic
                }
                vm.status.opened = true;
            };
        }]
    };
}]);
