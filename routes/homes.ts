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
	var filters = req.query['filters'];
	var sort = {};

	var filter_data = req['filter_data'];

	if (sidx && sidx !== '') {
		sort[sidx] = order;
	}

	Home.count((err, total) => {
		if (!err) {
			Home.aggregate(req['jqtable_query']).exec((err, homes) => {
				if (!err) {
					var result = {
						rows: homes,
						page: page,
						max: max,
						total: total
					};
					res.json(result);
				} else {
					res.status(500).send(err);
				}
			});
		} else {
			res.status(500).end();
		}
	});
});

router.post('/data', (req, res) => {
	var data = req.body;
	var request_type = data['oper'];

	delete data['oper'];
	delete data['id'];

	if (request_type === 'add') {

		var id = new mongoose.Types.ObjectId();
		var home = new Home(data);
		home["_id"] = id;

		home.save((err, result) => {
			console.log(result);
			if (!err) {
				res.status(201).end();
			}
			else {
				res.status(500).end();
			}
		});

	} else {
		var _id = data['_id'];
		delete data['_id'];

		if (request_type === 'edit') {

			Home.update({_id: _id}, data, {}, (err, result) => {
				console.log(result);
				if (!err) {
					res.status(200).end();
				}
				else {
					res.status(500).end();
				}
			});
		} else {
			if (request_type === 'del') {
				console.log(_id);
				Home.remove({_id: _id}, (err) => {
					if (!err) {
						res.status(200).end();
					}
					else {
						res.status(500).end();
					}
				});
			}
		}
	}
});
export = router;
