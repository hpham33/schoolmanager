'use strict';

angular.module('common').directive('hpGrid',
	[function () {
		return {
			restrict: 'E',
			controllerAs: 'vm',
			bindToController: true,
			template: '<div ui-grid="vm.gridConfig.gridOptions" ui-grid-infinite-scroll ui-grid-importer></div>',
			scope: {
				gridConfig: '='
			},
			controller: ['$log', '$scope', 'PaginationService', function ($log, $scope, PaginationService) {
				var vm = this;
				vm.gridConfig['isLoading'] = false;
				vm.gridConfig['searchParams'] = vm.gridConfig.searchParams || {};

				vm.gridConfig.gridOptions.onRegisterApi = function (gridApi) {
					vm.gridApi = gridApi;
					if (gridApi.infiniteScroll) {
						gridApi.infiniteScroll.on.needLoadMoreData($scope, vm.getDataDown);
					}

					gridApi.core.on.sortChanged($scope, vm.sortChanged);
				};

				vm.gridConfig['executeSearch'] = function () {
					return PaginationService.page(vm.gridConfig.resource.query, vm.gridConfig.searchParams)
						.then(function (page) {
							vm.page = page;
							vm.gridConfig.gridOptions.data = page.data;
							vm.gridApi.infiniteScroll.resetScroll(false, vm.page.hasNext());
						});
				};

				vm.getDataDown = function () {
					if (vm.page.hasNext()) {
						vm.gridConfig['isLoading'] = true;
						vm.page.next().then(function (page) {
							vm.gridApi.infiniteScroll.saveScrollPercentage();
							vm.page = page;
							vm.gridConfig.gridOptions.data = vm.gridConfig.gridOptions.data.concat(page.data);
							vm.gridApi.infiniteScroll.dataLoaded(false, vm.page.hasNext());
						}).finally(function () {
							vm.gridConfig['isLoading'] = false;
						});
					}
				};

				vm.sortChanged = function (grid, sortColumns) {
					if (sortColumns.length > 0) {
						vm.gridConfig.searchParams.orderBy = sortColumns[0].field;
						if (sortColumns[0].sort.direction === 'desc') {
							vm.gridConfig.searchParams.orderBy = '-' + sortColumns[0].field;
						}
					} else {
						delete vm.gridConfig.searchParams.orderBy;
					}
					vm.gridConfig['executeSearch']();
				};


				function generateCellTemplate() {
					_.forEach(vm.gridConfig.gridOptions.columnDefs, function (columnDef) {
						if (!_.isEmpty(columnDef.buttons)) {
							var cellTemplate = '<div class="ui-grid-cell-contents">%s</div>';
							var btnTemplate = '';

							for (var i = 0, len = columnDef.buttons.length; i < len; i++) {
								btnTemplate += generateButtonTemplate(columnDef.buttons[i].type, i, columnDef.buttons[i].title);
							}

							columnDef.cellTemplate = sprintf(cellTemplate, btnTemplate);
						}
					});
				}

				function generateButtonTemplate(btnType, btnIndex, text, title) {
					if (btnType === 'LINK') {
						return sprintf(
							'<a ng-click="col.colDef.buttons[%s].execute(row)" title="%s" class="clickable">' +
								'{{ col.colDef.buttons[%s].text(row) }}' +
							'</a>',
							btnIndex, title || '', btnIndex);
					} else {
						var buttonClass = '';
						switch (btnType) {
							case 'EDIT':
								buttonClass = 'glyphicon-pencil';
								break;
							case 'DELETE':
								buttonClass = 'glyphicon-remove';
								break;
						}
						return sprintf(
							'&nbsp;&nbsp;<button class="btn btn-default btn-xs" ng-click="col.colDef.buttons[%s].execute(row)" title="%s">' +
							'<i class="glyphicon %s"></i>' +
							'</button>&nbsp;&nbsp;',
							btnIndex, title || '', buttonClass);
					}
				}

				function init() {
					generateCellTemplate();
					vm.gridConfig['executeSearch']();
				}

				init();
			}],
			link: function (scope, element) {

			}
		};
	}]);
