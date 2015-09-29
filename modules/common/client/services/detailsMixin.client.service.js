'use strict';

angular.module('common').factory('DetailsMixin',
	['$q', '$rootScope',
	function($q, $rootScope) {

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
						return configuration.resource.update(result).$promise.then(successAction);
					}
					return configuration.resource.save(result).$promise.then(successAction);
				}

                function canSave() {
                    return configuration.scope.mainForm.$valid;
                }

				function refresh() {

				}

				return {
                    abort: abort,
					save: save,
                    canSave: canSave,
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
