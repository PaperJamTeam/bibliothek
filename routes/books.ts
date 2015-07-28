/**
 * Created by gharizanov on 28.7.2015 г..
 */
import express = require('express');
import Book = require('../models/Book');
import jqtable = require('./middleware/jqtable_middeware');

var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
	res.render('books');
});

router.use(jqtable.dataParser);

router.get('/data', jqtable.generalDataSourceService(Book));

router.post('/data', jqtable.generalCrudService(Book));

export = router;
