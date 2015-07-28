/// <reference path="../typings/tsd.d.ts" />
import express = require('express');
import Home = require('../models/Home');
import jqtable = require('./middleware/jqtable_middeware');

var router = express.Router();

router.get('/', (req, res) => {
	res.render('homes');
});

router.use(jqtable.dataParser);

router.get('/data', jqtable.generalDataSourceService(Home, false));

router.post('/data', jqtable.generalCrudService(Home));

export = router;
