/// <reference path="../typings/tsd.d.ts" />

import express = require('express');
import mongoose = require('mongoose');

import Home = require('../models/Home');

var router = express.Router();

/* GET homes page. */
router.get('/', (req, res) => {
	res.render('homes');
});

router.get('/data', (req, res) => {
	var page = req.query['page'];
	var max = req.query['max'];
	var sidx = req.query['sidx'];
	var order = req.query['sord'];
	var sort = {};

	if(sidx && sidx !== ''){
		sort[sidx] = order;
	}
	Home.count((err, total) => {
		if(!err){
			Home.find({})
				.sort(sort)
				.limit(max)
				.skip((page - 1) * max)
				.exec((err, homes) =>{
					if(!err){
						var result = {
							rows:homes,
							page:page,
							max:max,
							total: total
						};
						res.json(result);
					} else {
						res.status(500).end();
					}
				});
		} else {
			res.status(500).end();
		}
	});

});

export = router;
