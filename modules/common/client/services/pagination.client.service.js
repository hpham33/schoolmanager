'use strict';

angular.module('common').provider('PaginationService', [
	function() {
		var defaults = {
			pageIndex: 0,
			pageSize: 20
			},
			PEEK_SIZE = 1;

		function page(searchFn, searchParams, pageIndex) {
			searchParams = searchParams || {};
			var pageSize = searchParams.pageSize || defaults.pageSize;
			var startPageIndex = pageIndex || defaults.pageIndex;

			function loadPage() {
				function preProcessData(searchResult) {
					var data = searchResult;
					var hasNextPage = searchResult.length === pageSize + PEEK_SIZE;

					if (hasNextPage) {
						data.splice(data.length - 1, 1);
					}

					return {
						data: data,
						hasNextPage: hasNextPage
					};
				}

				searchParams.skip = startPageIndex * pageSize;
				searchParams.limit = pageSize + PEEK_SIZE;

				var searchFunction = searchFn.bind(null, searchParams);

				return searchFunction().$promise.then(preProcessData);
			}

			function makePageObject(pageResult) {
				function hasNext() {
					return pageResult.hasNextPage;
				}

				function next() {
					if (!hasNext()) {
						throw new Error('No page to go next');
					}
					return page(searchFn, searchParams, startPageIndex + 1);
				}

				function hasPrevious() {
					return startPageIndex !== 0;
				}

				function previous() {
					if (!hasPrevious()) {
						throw new Error('No page to go previous');
					}
					return page(searchFn, searchParams, startPageIndex - 1);
				}

				return {
					data: pageResult.data || [],
					hasNext: hasNext,
					next: next,
					hasPrevious: hasPrevious,
					previous: previous
				};
			}

			return loadPage().then(makePageObject);
		}

		return {
			defaults: defaults,
			$get: function() {
				return {
					page: page
				};
			}
		};
	}
]);
