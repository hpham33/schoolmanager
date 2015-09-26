'use strict';

angular.module('common').directive('hpUserHasRoles',
    ['hpUtils', function(hpUtils) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var allowedRoles = attrs.hpUserHasRoles.split(',').map(function(item) {
                    return item.trim();
                });
                if(!hpUtils.userHasRoles(allowedRoles)) {
                    element.remove();
                }
            }
        };
    }]);
