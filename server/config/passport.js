var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../users/User.js');

passport.use(new LocalStrategy(authenticateWithLocal));

function authenticateWithLocal(username, password, done) {
    User.findOne({ username: username }, function (err, user) {

        if (err) { return done(err); }

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
    });
}