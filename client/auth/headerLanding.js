(function () {
    'use strict'
    angular.module('ctu').directive('headerLanding', headerLanding);

    function headerLanding() {
        return {
            restrict: 'E',
            templateUrl: 'auth/header.html',
            controller: 'HeaderController'
        }
    };


}());

// angular.module('ctu').directive('headerLanding', function () {
//     return {
//         templateUrl: 'auth/header.html',
//         controller: 'home/HomeController'
//     };
// });
