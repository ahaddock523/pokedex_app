// Load express nodejs module
var express = require('express');

// Create express server app
var server = express ();

// Set public folder to be accessed by public user
server.use(express.static('public'));

// Port the server will run on
var port = 3000;
/////////////////////////////////////////////////////////////////
// server.listen(port, function(error) {
//     if (error !== undefined) {
//         console.error('*** ERROR: Unable to start the server.');
//         console.error(error);
//     }
//     else {
//         console.log(' - The server has successfully started on port: ' + port);
//     }
// });
////////////////////////////////////////////////////////////////
// Load the body-parser module
var bodyParser = require('body-parser');

// Set express to use body parser to pull data from POST requests
server.use(bodyParser.urlencoded({extended: true}));
//
// Set express to parse raw JSON data if sent
server.use(bodyParser.json());

// Load the method override so express can know the HTTP method to use
var methodOverride = require('method-override');

// Let express know that we are overriding the HTTP method
server.use(methodOverride (function(request, response) {
    if(request.body) {
        if(typeof request.body == 'object') {
            if(request.body._method) {
                var method = request.body._method

                delete request.body._method;

                return method;
            }
        }
    }
}));

// Load in the express session handler
var session = require ('express-session');

// Configure the session to be used by express
server.use(session({
    secret: 'This is my secret phrase', // Used to hash/encrypt the session key
    resave: false,
    saveUninitialized: true
}));

// load in the connect-flash express middleware
var flash = require ('connect-flash');

// Set our server app to use the flash message object.
server.use(flash());


server.use(function(request, response, next) {
    var user = request.session.user;
    if(user) {
        response.locals.user = user;

        if (user && user.type == 'admin') {
            user.admin = true;
        }
    }

    response.locals.message = request.flash();

    var contentType = request.headers['content-type'];
    request.contentType = contentType;

    console.log('****ct: ', contentType);

    if(request.contentType == 'application/json') {
        request.sendJson = true;
    }

    next();
})
// // Set a global function that will be run before any routes run.
// server.use (function(request, response, next) {
//     // Set the local data in the template to use the user session data.
//     response.locals.user = request.session.user;
//
//     // Set the flash object to be set and used
//     // before running any other routes or functions.
//     response.locals.message = request.flash();
//
//     // Grab the content-type from the request.
//     var contentType = request.headers['content-type'];
//     request.contentType = contentType;
//
//     // Set our request object to use JSON if application/json request is made
//     if (contentType == 'application/json') {
//         request.sendJson = true;
//     }
//
//     next();
//
// });



// Configure the render engine handlebars.
var handlebars = require('express-handlebars');
server.engine('.hbs', handlebars ({
    layoutsDir: 'templates', // The directory of layout files.
    defaultLayout: 'index', // The base / main template to always load.
    extname: '.hbs'         // The file extension to use.
}));

// Set the default directory for express to use for handlebars templates.
server.set ('views', __dirname + '/templates/partials');

// Set the render engine for our server.
server.set ('view engine', '.hbs');

// Bring in the MongoDB client driver
var mongoClient = require('mongodb').MongoClient;

// Reference to the database
global.db;

// Connection to database
mongoClient.connect ('mongodb://ahaddock:password@ds145369.mlab.com:45369/pokedex', function(error, database) {
    if(error) {
        console.error('*** ERROR: Unable to connec to the mongo database.');
        console.error(error);
    }
    else {
        server.listen(port, function(error) {
            if (error !== undefined) {
                console.error('*** ERROR: Unable to start server.');
                console.error(error);
            }
            else {
                db = database;

                console.log('- The server has successfully started on port: ' + port);
            }
        });
    }
});
//------------------------------------------------------------
// load mongoose nodejs package
var mongoose = require ('mongoose');

// Connect mongoose to mongodb server
mongoose.connect('mongodb://ahaddock:password@ds145369.mlab.com:45369/pokedex');

// set mongoose promise library to use
mongoose.Promise = require('bluebird');

//------------------------------------------------------------
// Set the url routes that the server can use.
var basicRoutes = require ('./routes/basic.js');

// Set our server to use the imported routes.
server.use('/', basicRoutes);

// Connect the pokemon routes
var pokeRoutes = require('./routes/pokemon.js');
server.use('/pokemon', pokeRoutes);

var userRoutes = require ('./routes/user.js');
server.use('/user', userRoutes);
