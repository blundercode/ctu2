(function () {
"use strict";

angular.module('ctu').factory('AuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['$q', '$storage', '$injector'];
    function AuthInterceptor($q, token$, $storage, $injector) {
        return {
            // attach the token to every request
            request: function (config) {
                var token = token$.getToken();
                if (!!token) {
                    config.headers['x-access-token'] = token;
                }

                return config;
            },

            // in case of errors
            responseError: function (response) {
                // in case of 403: forbidden redirecto to login page
                if (response.status === 403) {
                    token$.setToken();
                    $injector.get('$state').go('login');
                }

                return $q.reject(response);
            }
        };
    }

} ());