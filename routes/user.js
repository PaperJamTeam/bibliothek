'use strict';

const express = require('express');
const User = require('../models/User');
const jqtable = require('./middleware/jqtable_middeware');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
	res.render('users');
});

router.use(jqtable.dataParser);

router.get('/data', jqtable.generalDataSourceService(User));

router.post('/data', jqtable.generalCrudService(User));

module.exports = router;
