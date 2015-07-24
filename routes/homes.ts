/// <reference path="../typings/tsd.d.ts" />
import express = require('express');
import mongoose = require('mongoose');
import Home = require('../models/Home');
import jqtable = require('./middleware/jqtable_middeware');

var router = express.Router();

router.use(jqtable.dataParser);

router.get('/', (req, res) => {
	res.render('homes');
});

router.get('/data', jqtable.generalDataSourceService(Home));

router.post('/data', jqtable.generalCrudService(Home));

export = router;
