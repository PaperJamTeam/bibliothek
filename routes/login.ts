/// <reference path="../typings/tsd.d.ts" />

import express = require('express');
import passport = require('passport');

import User = require('../models/User');

var router = express.Router();

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
	(email, password, next) => {
		if (email !== 'gosho@bot.com') {
			return next(null, false, {message: 'Incorrect username'});
		}
		if (password !== '1234') {
			return next(null, false, {message: 'Incorrect password'});
		}
		return next(null, {u: 'a'});
	}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

/* GET Login page */

router.get('/', (req, res) => {
	res.render('login', {title: 'Login', message: ''});
});

router.post('/', passport.authenticate('local'), (req, res) => {
	res.render('index', {title: 'SUCCESS!'});
});

export = router;
