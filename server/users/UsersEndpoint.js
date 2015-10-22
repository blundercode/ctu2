var User = require('./User.js');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({ secret: 'I heart donuts', userProperty: 'payload' });
var mongoose = require('mongoose');

module.exports = function (server, express) {
    var router = express.Router();

    router.route('/register')
    // Create a new User
        .post(function (req, res, next) {
            if (!req.body.username || !req.body.password) {
                return res.status(400).json({ success: false, message: 'No username or pasword provided' });
            }

            var newUser = new User();

            newUser.username = req.body.username;
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.setPassword(req.body.password);

            newUser.save(function (err, user) {
                if (err != undefined && err != null) {
                    if (err.code === 11000) {
                        console.log('ERROR: User already exists.');
                        return res.status(400).json({ succes: false, message: 'ERROR: User already exists.' });
                    }

                    Object.keys(err.errors).forEach(function (key) {
                        var message = err.errors[key].message;
                        console.log('ERROR: Validation error for "%s": %s', key, message);
                    });

                    return res.status(400).json({ success: false, message: 'Could not create the user.' });
                } 
                console.log('LOG: User created!');
                res.status(201).json({
                    success: true,
                    data: {
                        token: user.generateJWT(),
                        username: user.username,
                        name: user.name,
                        email: user.email
                    }
                });
                
            });
        });

    router.route('/login')

        .post(function (req, res, next) {
            if (!req.body.username || !req.body.password) {
                return res.status(400).json({ message: 'Please fill out all the form' });
            }
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json(info);
                }
                else {
                    var data = {
                        token: user.generateJWT(),
                        username: user.username,
                        name: user.name,
                        email: user.email
                    };

                    res.status(200).json({
                        success: true,
                        data: data
                    });
                }
            })(req, res, next);

        });

    return router;
};
