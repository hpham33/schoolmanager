'use strict';

angular.module('common')
    .directive('hpButtonAbort',
    [function() {
        return {
            restrict: 'E',
            template: '<button type="button" class="btn btn-warning" ng-click="details.abort()"><i class="glyphicon glyphicon-remove"></i>&nbsp;Hủy</button>'
        };
    }])
    .directive('hpButtonSave',
    [function() {
        return {
            restrict: 'E',
            template:
            '<button type="button" class="btn btn-primary" hp-click-and-wait="details.save()" ng-disabled="!details.canSave()">' +
                '<i class="glyphicon glyphicon-floppy-disk"></i>&nbsp;' +
                '<span ng-if="details.data._id">Cập nhật</span>' +
                '<span ng-if="!details.data._id">Lưu</span>' +
            '</button>'
        };
    }]);
