var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var config = require('./config/database');
var routes = require('./config/routes');
var bodyParser = require('body-parser');
//var gulp = require('./gulpfile');

mongoose.connect(config.database);

var mongodb = mongoose.connection;

mongodb.on('error', function (e) {
    console.log(e.message);
});

mongodb.on('open', function () {
    console.log('Mongo is running!');

    var app = express();

    // static folders for html resources
    app.use('/css', express.static('./www/css'));
    app.use('/lib', express.static('./www/lib'));
    app.use('/js', express.static('./www/js'));
    app.use('/img', express.static('./www/img'));
    app.use('/templates', express.static('./www/templates'));

    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(routes);

    app.listen(3333, function () {
        console.log('Server is running!');
    });
});