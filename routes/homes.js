'use strict';

const express = require('express');
const Home = require('../models/Home');
const jqtable = require('./middleware/jqtable_middeware');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('homes');
});

router.use(jqtable.dataParser);

router.get('/data', jqtable.generalDataSourceService(Home, false));

router.post('/data', jqtable.generalCrudService(Home));

module.exports = router;
