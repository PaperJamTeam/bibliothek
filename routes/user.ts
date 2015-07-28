/// <reference path="../typings/tsd.d.ts" />
import express = require('express');
import User = require('../models/User');
import jqtable = require('./middleware/jqtable_middeware');

var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
	res.render('users');
});

router.use(jqtable.dataParser);

router.get('/data', jqtable.generalDataSourceService(User));

router.post('/data', jqtable.generalCrudService(User));

export = router;
