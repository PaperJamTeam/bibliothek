/// <reference path="../typings/tsd.d.ts" />

import express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
	res.render('index', { title: 'Express' });
});

router.get('/ajax/dashboard', (req, res) => {
	res.render('ajax/dashboard');
});

export = router;
