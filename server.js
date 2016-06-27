var mongoose = require('mongoose'),
    express = require('express'),
    cors = require('cors'),
    morgan = require('morgan'),
    config = require('./config/database'),
    routes = require('./config/routes'),
    bodyParser = require('body-parser')
    //var gulp = require('./gulpfile');

mongoose.connect(config.database);

var mongodb = mongoose.connection;

mongodb.on('error', function (e) {
    console.log(e.message);
});

mongodb.on('open', function () {
    console.log('Mongo is running!');

    var port = 27019,
        app = express();

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

    app.listen(27019, function () {
        console.log('Server is running on port ', port);
    });
});