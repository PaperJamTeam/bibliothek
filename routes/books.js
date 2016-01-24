/**
 * Created by gharizanov on 28.7.2015 г..
 */
'use strict';

const express = require('express');
const Book = require('../models/Book');
const jqtable = require('./middleware/jqtable_middeware');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
	res.render('books');
});

router.use(jqtable.dataParser);

router.get('/data', jqtable.generalDataSourceService(Book));

router.post('/data', jqtable.generalCrudService(Book));

module.exports = router;
