// server.js

// modules =================================================
var express        = require('express');
var validator      = require('express-validator');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var morgan         = require('morgan');
var mongoose       = require('mongoose');

// configuration ===========================================

// config files
var config = require('./config/config');

// set our port
var port = process.env.PORT || 46580; 

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.Promise = global.Promise;
mongoose.connect(config.database); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(validator([]));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

app.use(morgan('dev'));

// routes ==================================================

var nodes = require('./app/controllers/nodes');

app.use('/', nodes);

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;                         


