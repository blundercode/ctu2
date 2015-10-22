(function () {
    "use strict";

    angular.module('ctu').factory('storage$', StorageService);

    StorageService.$inject = ['$window'];
    function StorageService($window) {
        return {
            // get the object
            getItem: function (data) {
                return JSON.parse($window.localStorage.getItem(data));
            },

            // set or clear the object
            setItem: function (key, data) {
                if (data) {
                    $window.localStorage.setItem(key, data);
                } 
                else {
                    $window.localStorage.removeItem(key);
                }
            },
            removeItem: function (data) {
                $window.localStorage.removeItem(data);
            }
        };
    }

} ());