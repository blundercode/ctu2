(function () {
    "use strict";

    angular.module('ctu').service('auth$', AuthService);

    AuthService.$inject = ['$http', '$q', '$window', '$rootScope', 'storage$'];
    function AuthService($http, $q, $window, $rootScope, storage$) {
        var me = this;

        angular.element($window).on('storage', function (event) {
            if (event.key === 'user') {
                $rootScope.$apply();
            }
        });

        me.login = function (credentials) {
            var deferred = $q.defer();
            $http.post('/api/users/login', credentials)
                .success(function (response) {
                    deferred.resolve(response.data);
                })
                .error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        };

        me.register = function (userData) {
            var deferred = $q.defer();

            $http.post('/api/users/register', userData)
                .success(function(response) {
                    console.log(response);
                    deferred.resolve(response.data);
                })
                .error(function(error) {
                    deferred.reject(error)
                });
            return deferred.promise;

        };
    }

} ());