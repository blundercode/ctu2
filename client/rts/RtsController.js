(function () {
    "use strict";

    angular.module('ctu').controller('RtsController', RtsController);

    RtsController.$inject = [
        '$state', '$window', '$scope', '$stateParams', '$timeout', '$location', 'notify$', 'skylink$', 'data$'
    ];
    function RtsController($state, $window, $scope, $stateParams, $timeout, $location, notify$, skylink$, data$) {
        var me = this;

        me.sharingScreen = false;
        me.inRoom = false;
        me.micOn = true;
        me.cameraOn = true;
        me.showTopic = true;
        me.showChat = false;
        me.showOptions = true;
        me.showPeers = true;
        me.participants = 0;
        me.loggedInUser = data$.loggedInUser;

        //////////////////////////////////////
        //Room maintenece////////////////////
        //////////////////////////////////////

        me.joinRoom = function () {
            notify$.success('in room');
            me.inRoom = true;
            var rtsName = $stateParams.roomId;
            console.log(rtsName);
            skylink$.joinRoom(rtsName, {
                'audio': true,
                'video': {
                    'resolution': {
                        'width': 768,
                        'height': 432
                    }
                }
            });
        };


        me.leaveRoom = function () {
            skylink$.leaveRoom(function (err, success) {
                if (err) {
                    console.log('leaveroom err:', err);
                    notify$.error('Error leaving the room, view browser console for more details');
                } else {
                    me.inRoom = false;
                    $state.go('home');
                }
            });
        };

        me.toggleChat = function () {
            me.showChat = !me.showChat;
        };

        me.togglePeers = function () {
            me.showPeers = !me.showPeers;
        };

        //////////////////////////////////////
        //functionality of chat///////////////
        //////////////////////////////////////

        me.sendMessage = function () {
            var line = me.loggedInUser.username + ': ' + me.chatInput;
            skylink$.sendP2PMessage(line);
            me.chatInput = '';
            $('#chat-input').focus();
        };

        me.start = function () {
            skylink$.shareScreen();
            me.sharingScreen = true;
        };

        me.turnOffMic = function () {
            skylink$.muteStream({
                audioMuted: true,
                videoMuted: false,
            });

            me.micOn = false;
        };

        me.turnOnMic = function () {
            skylink$.muteStream({
                audioMuted: false,
                videoMuted: false,
            });

            me.micOn = true;
        };

        me.turnOffCam = function () {
            skylink$.muteStream({
                audioMuted: false,
                videoMuted: true,
            });

            me.cameraOn = false;
        };

        me.turnOnCam = function () {
            skylink$.muteStream({
                audioMuted: false,
                videoMuted: false,
            });

            me.cameraOn = true;
        };

        me.observe = function () {
            skylink$.muteStream({
                audioMuted: true,
                videoMuted: true,
            });

            me.micOn = me.cameraOn = false;
        };

        me.showFace = function () {
            me.sharingScreen = false;

            skylink$.stopScreen();
            skylink$.sendStream({
                audio: true,
                video: true,
            });
        };

        //////////////////////////////////////
        //Meat of Skylink video & audio///////
        //////////////////////////////////////

        me.spotlight = function (id) {
            // console.log('sending ' + id + ' to spotlight');
            console.log('sending to spotlight');
        };

        //  function to set what room they are going to join
        me.counter = 120;
        // me.onTimeout = function () {
        //     me.counter--;
        //     mytimeout = $timeout(me.onTimeout, 1000);
        //     if (me.counter === 110) {
        //         console.log('Hey you!');
        //     }
        //     if (me.counter === 106) {
        //         console.log('It\'s about time you started listening to me');
        //     }
        //     if (me.counter === 100) {
        //         console.log('Now listen very carefully');
        //     }
        //     if (me.counter === 96) {
        //         console.log('Someones coming for you');
        //     }
        //     if (me.counter === 94) {
        //         console.log('You need to get out of there!');
        //     }
        //     if (me.counter === 90) {
        //         console.log('Run Now!!');
        //     }
        //     if (me.counter === 90) {
        //         console.log('Why are you still here go now!');
        //     }
        // };
        // var mytimeout = $timeout(me.onTimeout, 1000);

        me.stop = function () {
            if (me.counter === 55) {
                me.stop;
            }
        };

        skylink$.on('peerJoined', function (peerId, peerInfo, isSelf) {
            me.participants += 1;
            if (isSelf) return; // We already have a video element for our video and don't need to create a new one.

            var vid = document.createElement('video');
            vid.autoplay = true;
            vid.muted = false; // Added to avoid feedback when testing locally
            vid.id = peerId;
            vid.className = 'peer';

            var peer = $(vid);
            $('#peers').append(peer);
            peer.on('click', function () {
                var spotlight = $('#spotlight');
                var spotlighted = $('.spotlight');
                spotlighted.attr('class', 'peer');
                $('#peers').append(spotlighted);

                spotlight.empty();
                var me = $(this);
                spotlight.append(me);
                me.get(0).play();
                me.attr('class', 'spotlight');
            });

        });

        skylink$.on('incomingStream', function (peerId, stream, isSelf) {
            if (isSelf) return;
            var vid = document.getElementById(peerId);
            attachMediaStream(vid, stream);
        });

        skylink$.on('peerLeft', function (peerId, peerInfo, isSelf) {
            if (isSelf) {
                notify$.success('You left the room');
            } else {
                me.participants -= 1;
                $('#' + peerId).remove();
            }
        });

        skylink$.on('mediaAccessSuccess', function (stream) {
            var vid = document.getElementById('myvideo');
            attachMediaStream(vid, stream);
        });

        var testingKey = '852c636a-90b2-4787-bc42-7a186221858f';
        var masterKey = '7be3e80b-e2aa-4d13-84b7-6d3209b17f14';
        var skylinkKey = '0e16be15-7440-4072-85fc-c1266852cb7f';

        // skylink$.init({
        //     apiKey: skylinkKey,
        //     defaultRoom: getRoomId()
        // });


        me.joinRoom();

        //////////////////////////////////////
        //Text chat code///////////////
        //////////////////////////////////////

        skylink$.on('incomingMessage', function (message, peerId, peerInfo, isSelf, name) {
            var className = 'chat-others';

            if (isSelf) {
                className = 'chat-mine';
            }

            addMessage(message.content, className);
        });

        function addMessage(message, className) {
            var chatbox = document.getElementById('chatbox'),
                div = document.createElement('div');
            div.className = className;
            div.textContent = message;
            chatbox.appendChild(div);
        }

        /* Helper functions */

        function getRoomId() {
            var roomId = document.cookie.match(/roomId=([a-z0-9-]{36})/);
            if (roomId) {
                return roomId[1];
            }
            else {
                roomId = skylink$.generateUUID();
                var date = new Date();
                date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
                document.cookie = 'roomId=' + roomId + '; expires=' + date.toGMTString() + '; path=/';
                return roomId;
            }
        };
    }

} ());
