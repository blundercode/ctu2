(function () {
    "use strict";

    angular.module('ctu').factory('skylink$', SkylinkFactory);

    SkylinkFactory.$inject = [];
    function SkylinkFactory() {
        var skylinkKey = '0e16be15-7440-4072-85fc-c1266852cb7f';
        var skylink = new Skylink();
        skylink.init({
            'apiKey': skylinkKey,
            // 'forceSSL': true,
            'socketTimeout': 5000
        });

        return skylink;
    }

} ());