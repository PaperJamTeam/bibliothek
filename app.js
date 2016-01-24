'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const loggerMorgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const logger = require('./logger');

const routes = require('./routes/index');
const homes = require('./routes/homes');
const books = require('./routes/books');
const users = require('./routes/user');
const login = require('./routes/login');

mongoose.connect('mongodb://127.0.0.1:27017/bibliothek', (err) => {
	if (err) {
		logger.error("Could not connect to MongoDB (" + err.message + ")");
		setTimeout(process.exit, 10, -1);
	} else {
		logger.info('Connected to MongoDB');
	}
});

const app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(loggerMorgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/homes', homes);
app.use('/books', books);
app.use('/users', users);
app.use('/login', login);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err['status'] = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
	app.use((err, req, res) => {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err,
			title: 'error'
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
		title: 'error'
	});
});


module.exports = app;
