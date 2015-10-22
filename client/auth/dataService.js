(function () {
    'use strict';

    angular.module('ctu').service('DataService', DataService);

    DataService.$inject = ['$http', '$q', '$window', 'notify$'];
    function DataService($http, $q, $window, notify$) {

        var me = this;

        // berts
        me.auth = {};

        me.auth.saveToken = function (token) {
            $window.localStorage['ctu-token'] = token;
        };

        me.auth.getToken = function () {
            return $window.localStorage['ctu-token'];
        };

        me.auth.isLoggedIn = function () {
            var token = me.auth.getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        me.auth.currentuser = function () {
            if (me.auth.isLoggedIn()) {
                var token = me.auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        me.auth.register = function (user) {
            return $http.post('/register', user).success(function (data) {

            });
        };

        me.auth.logIn = function (user) {
            return $http.post('/login', user).success(function (data) {
                me.auth.saveToken(data.token);
            });
        };

        me.auth.logOut = function () {
            $window.localStorage.removeItem('ctu-token');
        };

        // andys

        me.registerUser = function (user) {
            var dfd = $q.defer();

            $http.post('/api/users', { 'user': user })
                .success(function (response) {
                    notify$.success('registered user: ' + response.data);
                    dfd.resolve(response.data);
                })
                .error(function (err) {
                    dfd.reject(err.data.message);
                    notify$.error(err.data.message);
                    dfd.reject('Failed to register the user');
                });

            return dfd.promise;
        };

        me.loginUser = function (user) {
            var dfd = $q.defer();

            $http.post('/api/users/login', user)
                .success(function (response) {
                    dfd.resolve(response.data);
                    console.log(response.data);
                })
                .error(function (err) {
                    dfd.reject(err.data.message);
                    console.error(err.data.message);
                });

            return dfd.promise;

        };

        

    }

} ());
