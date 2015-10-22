(function () {
"use strict";
var app = angular.module('ctu');

app.value('toastr', toastr);

angular.module('ctu').factory('notify$', NotifyFactory);

NotifyFactory.$inject = ['toastr'];
function NotifyFactory(toastr) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-center",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "2000",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "closeMethod": "fadeOut"
    };

    return {
        success: function (message) {
            toastr.success(message, 'Cool!');
        },
        error: function (message) {
            toastr.error(message, 'Oops!');
        },
        info: function (message) {
            toastr.info(message, 'You Should Know');
        },
        warning: function (message) {
            toastr.warning(message, 'Be Careful');
        }
    };
}

} ());