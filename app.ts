/// <reference path='./typings/tsd.d.ts' />

import express = require('express');
import path = require('path');
import favicon = require('serve-favicon');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import passport = require('passport');
import mongoose = require('mongoose');

import routes = require('./routes/index');
import homes = require('./routes/homes');
import books = require('./routes/books');
import users = require('./routes/user');
import login = require('./routes/login');

mongoose.connect('mongodb://127.0.0.1:27017/bibliothek', (err) => {
	if(err) {
		console.error(
			"[ERROR] (" + new Date().toUTCString() + ")",
			"could not connect to MongoDB (" + err.message + ")"
		);
		process.exit(-1);
	}
});

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
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
	var err = new Error('Not Found');
	err['status'] = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
	app.use((err: any, req, res, next) => {
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
app.use((err: any, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
		title: 'error'
	});
});


export = app;
