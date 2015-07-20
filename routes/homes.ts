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

router.post('/data', (req, res) => {
<<<<<<< HEAD
	var data = req.body;
	console.log(data);

	var request_type = data['oper'];
	delete data['oper'];
	delete data['id'];

	if(request_type === 'add'){
		var id = mongoose.Types.ObjectId();
		var home = new Home(data);

=======
	var request_type = req.body['oper'];
	var id = mongoose.Types.ObjectId();

	if(request_type === 'add'){
		var home = new Home(req.body);
>>>>>>> origin/master
		home["_id"] = id;
		home.save( (err, res) => {
			console.log(res);
			if(!err){
				res.status(201).end();
			} else {
				res.status(500).end();
			}
		})
	} else {
		if(request_type === 'edit'){

<<<<<<< HEAD
			var _id = data['_id'];
			delete data['_id'];
=======
>>>>>>> origin/master
		}
	}


});

export = router;
