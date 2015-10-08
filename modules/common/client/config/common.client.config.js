'use strict';

angular.module('common').config(
    ['datepickerConfig', 'datepickerPopupConfig', '$provide', 'PaginationServiceProvider',
        function (datepickerConfig, datepickerPopupConfig, $provide, PaginationServiceProvider) {

            datepickerConfig.startingDay = 0;
            datepickerConfig.showWeeks = false;

            datepickerPopupConfig.showButtonBar = false;
            datepickerPopupConfig.datepickerPopup = 'dd.MM.yyyy';

            $provide.decorator('GridOptions',
                ['uiGridConstants', '$delegate',
                    function (uiGridConstants, $delegate) {
                        var gridOptions;
                        gridOptions = angular.copy($delegate);
                        gridOptions.initialize = function (options) {
                            var initOptions;
                            initOptions = $delegate.initialize(options);
                            initOptions.enableColumnMenus = false;
                            initOptions.infiniteScrollUp = false;
                            initOptions.infiniteScrollDown = true;
                            initOptions.infiniteScrollRowsFromEnd = 15;
                            initOptions.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
                            initOptions.rowHeight = 35;
                            return initOptions;
                        };
                        return gridOptions;
                    }]);

            PaginationServiceProvider.defaults.pageSize = 40;
        }]);
