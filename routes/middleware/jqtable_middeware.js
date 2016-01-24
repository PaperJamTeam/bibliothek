'use strict';

const mongoose = require('mongoose');
const logger = require('../../logger');

const dataParser = (req, res, next) => {
	const page = req.query['page'];
	const max = req.query['max'];
	const sidx = req.query['sidx'];
	const order = req.query['sord'];
	let filters = req.query['filters'];

	const agg = [];

	agg.unshift({'$limit': Number(max)});
	agg.unshift({'$skip': Number((page - 1) * max)});

	const sort = {};

	if (sidx && sidx !== '' && order) {
		if(order == 'asc'){
			sort[sidx] = 1;
		} else {
			sort[sidx] = -1;
		}
		agg.unshift({'$sort': sort});
	}

	req['jqtable_query'] = agg;

	const grouped_filters = [];
	let filter_data = {};
	req['filter_data'] = filter_data;

	if (!filters) {
		next();
		return;
	}

	filters = JSON.parse(filters);

	if (!filters['rules']) {
		next();
		return;
	}

	filters['rules'].forEach((filter) => {
		const filter_entry = {};
		switch (filter['op']) {
			case "eq":
			{ //equal
				filter_entry[filter['field']] = filter['data'];
				break;
			}
			case "ne":
			{ //not equal
				filter_entry[filter['field']] = {$ne: filter['data']};
				break;
			}
			case "bw":
			{ //begins with
				filter_entry[filter['field']] = new RegExp("^" + filter['data'] + ".*");
				break;
			}
			case "bn":
			{ //does not begin with
				filter_entry[filter['field']] = {$not: new RegExp("^" + filter['data'] + ".*")};
				break;
			}
			case "ew":
			{ //ends with
				filter_entry[filter['field']] = new RegExp(".*" + filter['data']);
				break;
			}
			case "en":
			{ //does not end with
				filter_entry[filter['field']] = {$not: new RegExp(".*" + filter['data'])};
				break;
			}
			case "cn":
			{ //contains
				filter_entry[filter['field']] = new RegExp(".*" + filter['data'] + ".*");
				break;
			}
			case "nc":
			{ //does not contain
				filter_entry[filter['field']] = {$not: new RegExp(".*" + filter['data'] + ".*")};
				break;
			}
			case "nu":
			{ //not equal
				filter_entry[filter['field']] = new RegExp(" *");
				break;
			}
			case "nn":
			{ //not equal
				filter_entry[filter['field']] = {$not: new RegExp(" *")};
				break;
			}
		}
		grouped_filters.push(filter_entry);
	});

	if (filters['groupOp'] === "AND") {
		filter_data = {$and: grouped_filters}
	} else {
		filter_data = {$or: grouped_filters}
	}

	agg.unshift({'$match' : filter_data});

	req['jqtable_query'] = agg;

	next();
};

const generalDataSourceService = (Model, lazy) => {
	if(typeof lazy === 'undefined') {
		lazy = true;
	}
	return (req, res) => {
		const page = req.query['page'];
		const max = req.query['max'];
		const parsedJqReqData = req['jqtable_query'];

		if(lazy){
			generateJqtableData(Model, {page: page, rows: max, query: parsedJqReqData}, (err, data) => {
				if(!err){
					res.json(data);
				} else {
					console.log(err);
					res.status(500).send();
				}
			})
		} else {
			Model.find((err, data) => {
				if(!err){
					res.json(data);
				} else {
					console.log(err);
					res.status(500).send();
				}
			});
		}
	}
};

const generateJqtableData = (Model, reqData, cb) => {
	Model.count((err, total) => {
		if (!err) {
			Model.aggregate(reqData.query).exec((err, data) => {
				if (!err) {
					cb(null, {
						rows: data,
						page: reqData.page,
						max: reqData.rows,
						total: total
					});
				} else {
					cb(err);
				}
			});
		} else {
			cb(err);
		}
	});
};

const operation = {
	CREATE: "add",
	UPDATE: "edit",
	DELETE: "del",
};

const generalCrudService = (Model) => {
	return (req, res) => {

		const data = req.body;
		const operation = data['oper'];
		const id = data['id'];

		delete data['id'];
		delete data['oper'];

		switch(operation){
			case operation.CREATE: {
				(new Model(data)).save(respondWith(res, 201, "Unable to create entry"));
				break;
			} case operation.UPDATE: {
				Model.update({_id: id}, data, {/* options */}, respondWith(res, 200, "Unable to update entry"));
				break;
			} case operation.DELETE: {
				Model.remove({_id:id}, respondWith(res, 200, "Unable to renove entry"));
				break;
			} default : {
				res.status(400).send();
			}
		}
	};
};

const respondWith = (res, successStatus, errMessage) => {
	return (err) => {
		if(!err){
			res.status(successStatus).send();
		} else {
			logger.error(err);
			res.status(500).send(errMessage);
		}
	}
};

module.exports = {
	dataParser,
	generalDataSourceService,
	generateJqtableData,
	generalCrudService,
	respondWith
};
