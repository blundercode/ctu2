(function () {
    angular.module('ctu').controller('HeaderController', HeaderController);

    function HeaderController() {
        var me = this;

        me.pizza = "pizza";

        me.registerUser = function (user) {
            console.log(user);
        };

    };
} ());