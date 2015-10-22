(function () {
    "use strict";

    var ctu = angular.module('ctu', ['ui.router', 'ngResource']);

    angular.module('ctu').config(ConfigureApplication);

    ConfigureApplication.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    function ConfigureApplication($stateManager, $urlRouterProvider, $locationProvider) {
        // default state
        $urlRouterProvider.otherwise('/');

        $stateManager.state('home', new State('/', 'home/home.html', 'HomeController as home'));
        $stateManager.state('rts', new State('/rts/:roomId', '/rts/rts.html', 'RtsController as rts'));
        $stateManager.state('team', new State('/team/', '/team/team.html', ''));
        $stateManager.state('about', new State('/about/', '/about/about.html', 'aboutController as about'));

        // remove # from client routes
        $locationProvider.html5Mode(true);
    }

    // constructor function to generate states
    function State(url, templateUrl, controller, data) {
        var state = this;

        if (!!url) {
            state.url = url;
        }
        if (!!templateUrl) {
            state.templateUrl = templateUrl;
        }
        if (!!controller) {
            state.controller = controller;
        }
        if (!!data) {
            state.data = data;
        }
    }

    ctu.run(function ($state, $rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toState.name === 'rts') {
                console.log(toParams);
                if (!toParams.roomId) {
                    event.preventDefault();
                }
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.$state = $state;
        });
    });

} ());
