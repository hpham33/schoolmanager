'use strict';

angular.module('common').factory('DetailsMixin',
	['$q',
	function($q) {

		function details(configuration) {
			function loadDetail() {
				var deferred = $q.defer();

				if (configuration.scope.data.__id) {
					var param = {};
					param[configuration.scope.data.idField] = configuration.scope.data.__id;

					configuration.resource.get(param).$promise.then(function(response) {
						deferred.resolve(response);
					}, function(errorResponse) {
						deferred.reject(errorResponse);
					});
				} else {
					deferred.resolve({});
				}
				return deferred.promise;
			}

			function makeDetailsObject(result) {
                function abort() {
                    configuration.scope.data.$modalInstance.dismiss('cancel');
                }

				function save() {
                    function successAction(response) {
                        if (configuration.scope.data.$modalInstance) {
                            configuration.scope.data.$modalInstance.close(response);
                        }
                        return response;
                    }

					if (configuration.scope.data.__id) {
						return configuration.resource.update(result).then(successAction);
					}
					return configuration.resource.save(result).then(successAction);
				}

				function refresh() {

				}

				return {
                    abort: abort,
					save: save,
					refresh: refresh,
					data: result
				};
			}

			return loadDetail().then(makeDetailsObject);
		}

		return {
			details: details
		};
}]);
