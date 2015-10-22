(function () {
    'use strict';

    angular.module('ctu').service('QuestionsService', QuestionsService);

    function QuestionsService($http, $q) {
        var me = this;

        me.liveQuestions = function () {
            return [
                {
                    "title": "Basics of React",
                    "description": "I really want to set up a React App and I am not sure where things go. I would love to walk"
                },
                {
                    "title": "Problems with ng-show",
                    "description": "How do I show a div only when the user is logged in?"
                }
            ];
        };

        me.postQuestion = function (question) {
            var dfd = $q.defer();

            $http.post('/api/questions', { 'question': question })
                .success(function (response) {
                    console.log(response.data);
                    dfd.resolve(response.data);
                })
                .error(function (error) {
                    dfd.reject(error);
                });

            return dfd.promise;
        };

        me.getQuestions = function () {

            var dfd = $q.defer();
            $http({
                method: 'GET',
                url: '/api/questions'
            }).then(function (response) {
                dfd.resolve(response.data);
                me.questions = response.data;
            });

            return dfd.promise;
        };

    }

} ());
