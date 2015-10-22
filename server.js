var express = require('express'),
    https = require('https'),
    htps = require('http'),
    fs = require('fs'),
    db = require('./server/config/database.js'),
    config = require('./server/config/passport.js'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
   // cookieParser = require('cookie-parser'),
    questionsEndpoint = require('./server/questions/QuestionsEndpoint.js')(server, express),
    usersEndpoint = require('./server/users/UsersEndpoint.js')(server, express),
    port = process.env.PORT || 8080,
    server = express();

// configure SSL certificate
var sslOptions = {
    key: fs.readFileSync('cert/ssl.key'),
    cert: fs.readFileSync('cert/public.cer')
};


// connect to the database as soon as the application starts
db.connect();

// configure middleware starting here
server.use(cors()); // enable Cross Origin Resource Sharing
server.use(bodyParser.urlencoded({ extended: true })); // can handle form data
server.use(bodyParser.json());  // and json

// endpoints
server.use('/api/questions', questionsEndpoint);
server.use('/api/users', usersEndpoint);
// server.use('/api/users/login', usersEndpoint);


// middleware to send client application to the browser
server.use(express.static(__dirname + '/client'));
server.use(passport.initialize());

// *** all other code should be included before this line *** \\
// catch all route and support for html5mode (no # on client routes)
server.all('/*', function (req, res, next) {
    res.sendFile('index.html', { root: __dirname + '/client' });
});

https.createServer(sslOptions, server).listen(port, function () {
    console.log('port:', port);
});

// server.listen(port, function () {
//     console.log('server running on port', port);
// });
