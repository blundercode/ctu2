###Routing
We will use angular-ui-router instead of ngRoute and angular material for layout and styling.

###Main files
The following files live at the root of the client folder:
- app.js: contains the main application module ('ctu').
- app.css: contains the css for the application.
- readme.md: contains notes we would like to share with the team.
- index.html: the chrome (or shell) of the application. Common navigation and the ui-view elements go here.

###Remove hash tag from url
Routes do not require use of # anymore. Added <base href="/"> to index.html and
$locationProvider.html5Mode(true); to the app.js on the client. On the server added:

    server.all('/*', function (req, res, next) {
        res.sendFile('index.html', { root: __dirname + '/client' });
    });

This catches all routes not handled by the server and sends it to the client to handle.

