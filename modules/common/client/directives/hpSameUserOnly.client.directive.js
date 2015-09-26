'use strict';

angular.module('common').directive('hpSameUserOnly',
    ['hpUtils', 'Authentication', function(hpUtils, Authentication) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var userId = attrs.hpSameUserOnly;
                var allowedUserId = Authentication.user && Authentication.user._id || '';
                if(userId !== allowedUserId) {
                    element.remove();
                }
            }
        };
    }]);
