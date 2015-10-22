(function () {
    'use strict';

    angular.module('ctu').controller('AppController', AppController);
    AppController.$inject = ['auth$', 'DataService', 'notify$', 'storage$', '$scope', '$state'];

    function AppController(auth$, data$, notify$, storage$, $scope, $state) {
        var me = this;

        me.loggedInUser = storage$.getItem('user');

        me.register = function ($event) { // $event comes from the ng-submit on the form
            $event.preventDefault(); // stop the form from submitting (page refresh)
            auth$.register(me.registerData).then(function(response) {
                storage$.setItem('user', JSON.stringify(response));
                me.loggedInUser = response;
            });
        };

        me.login = function ($event) {
            $event.preventDefault();
            
            auth$.login(me.loginData).then(
                function (result) {
                    var user = {
                        name: result.name,
                        username: result.username,
                        email: result.email
                    };
                    storage$.setItem('user', JSON.stringify(user));
                    storage$.setItem('ctu', JSON.stringify(result));
                    me.loggedInUser = user;
                    $state.go($state.current, {}, {reload: true});
                },
                function (error) {
                    storage$.removeItem('user');
                    notify$.error('Could not log in user, please verify credentials and try again.');
                    me.loggedInUser = undefined;
                });
        };

        me.logout = function () {
            storage$.removeItem('user');
            storage$.removeItem('ctu');
            me.loggedInUser = undefined;
            notify$.info('logged out');
            $state.go($state.current, {}, {reload: true});
        };

        me.updateUsername = function () {
            if (me.registerData.email && me.registerData.email.length > 0) {
                me.registerData.username = me.registerData.email.split('@')[0];
            }
        };

        me.passwordsDontMatch = true;

        me.comparePasswords = function () {
            me.passwordsDontMatch = me.registerData.password !== me.registerData.confirmPassword;
        };

    };

} ());
