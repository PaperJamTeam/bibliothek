'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */

router.get('/', (req, res) => {
	res.render('index', { title: 'Express' });
});

router.get('/ajax/dashboard', (req, res) => {
	res.render('ajax/dashboard');
});

module.exports = router;
