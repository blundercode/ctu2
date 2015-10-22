(function () {
    'use strict';

    angular.module('ctu').controller('HomeController', HomeController);

    HomeController.$inject = ['QuestionsService', 'DataService', '$location', '$state', 'storage$', 'notify$'];
    function HomeController(question$, data$, $location, $state, storage$, notify$) {
        var me = this;

        me.loggedInUser = storage$.getItem('user');

        question$.getQuestions().then(
            function (data) {
                me.questions = data;
            },
            function (error) {
                notify$.error('Could not retrieve the questions from the DB');
            });

        me.liveQuestions = question$.liveQuestions();

        me.postQuestion = function (question) {
            // attach username to question
            question.postedBy = me.loggedInUser.username;
            console.log('question:', question);

            question$.postQuestion(question).then(
                function (response) {
                    me.questions.push(response);
                },
                function (error) {
                    console.log(error);
                });

            me.question = {};
        };

        me.joinRoom = function (roomName) {
            $location.path('/rts/' + roomName);
        };

        me.answer = function (roomName) {
            // motify questioneer

            // send mentor to room
            $location.path('/rts/' + roomName);

            // when they are in room, start countdown
        };
    }

} ());
