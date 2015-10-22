(function () {
    "use strict";

    angular.module('ctu').service('data$', DataService);

    DataService.$inject = ['storage$'];
    function DataService(storage$) {
        var me = this;

        me.loggedInUser = storage$.getItem('user');
    }

} ());