// The best practice is to open the connection at application start and keep it open
// but it should be closed manually when the application stops (node process ends).
// To have connections closed when application stops setup a callback to node's process 'SIGINT'
// process.on('SIGINT', function () { require( 'DatabaseManager').close(usersDb); process.exit(0); })

var odm = require('mongoose'),
    // credentials = require('../../private/credentials.js'),
    //dbAddress = 'mongodb://bertdawg76:admin@ds029107.mongolab.com:29107/webrtc',
    mongolab = 'mongodb://admin:cometeachus@ds042128.mongolab.com:42128/ctu',
    ctudb = 'ctu',
    remoteDb = 'mongodb://ds042128.mongolab.com:42128/ctu',
    localDb = 'mongodb://localhost/ctu';


odm.connection.on('connected', function () {
    console.log('EVENT: Connected to: ' + remoteDb);
});

odm.connection.on('error', function () {
    console.log('EVENT: ERROR: Cannot connect to database.');
});

odm.connection.on('disconnected', function () {
    console.log('EVENT: Disconnected from: ' + remoteDb);
});

odm.connection.on('SIGINT', function () {
    odm.connection.close(function () {
        console.log('EVENT: Database connection terminated because application was closed.');
        process.exit(0);
    });
});

module.exports = {
    connect: function (url, dbName) {
        // var dbUri = url || dbAddress;
        // var name = dbName || ctudb;
        // dbUri += name;

        odm.connect(mongolab);

        // alternate syntax when connecting to multiple dbs and passing optional options (json object)
        // var studentsDb = odm.createConnection(dbUri, credentials.s3db);
        odm.connection.once('open', function () {
            console.log('All your data are belong to us!');
        });
    },
    close: function (db) {
        // use this if using default connection (mongoose.connect())
        // alternative a callback function can be passed like so odm.connection.close(callback)
        odm.connection.close();

        // when using named connections use this. An optional callback is also permitted
        // db.close(function() {}). db is the parameter passed in (database connection name)
    }
};