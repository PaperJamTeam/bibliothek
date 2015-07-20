/// <reference path="../typings/tsd.d.ts" />
var express = require('express');
var mongoose = require('mongoose');
var Home = require('../models/Home');
var router = express.Router();
/* GET homes page. */
router.get('/', function (req, res) {
	res.render('homes');
});
router.get('/data', function (req, res) {
	var page = req.query['page'];
	var max = req.query['max'];
	var sidx = req.query['sidx'];
	var order = req.query['sord'];
	var sort = {};
	if (sidx && sidx !== '') {
		sort[sidx] = order;
	}
	Home.count(function (err, total) {
		if (!err) {
			Home.find({}).sort(sort).limit(max).skip((page - 1) * max).exec(function (err, homes) {
				if (!err) {
					var result = {
						rows: homes,
						page: page,
						max: max,
						total: total
					};
					res.json(result);
				}
				else {
					res.status(500).end();
				}
			});
		}
		else {
			res.status(500).end();
		}
	});
});
router.post('/data', function (req, res) {
	var data = req.body;
	var request_type = data['oper'];

	delete data['oper'];
	delete data['id'];

	if (request_type === 'add') {
		var id = mongoose.Types.ObjectId();
		var home = new Home(data);
		home["_id"] = id;
		home.save(function (err, result) {
			console.log(result);
			if (!err) {
				res.status(201).end();
			}
			else {
				res.status(500).end();
			}
		});
	}
	else {
		var _id = data['_id'];
		delete data['_id'];

		if (request_type === 'edit') {

			Home.update({_id:_id}, data, {}, function(err, result) {
				console.log(result);
				if (!err) {
					res.status(200).end();
				}
				else {
					res.status(500).end();
				}
			});
		} else {
			if(request_type === 'del'){
				console.log(_id);
				Home.remove({_id : _id}, function(err, result){
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
module.exports = router;
//# sourceMappingURL=homes.js.map
