/// <reference path="../../typings/tsd.d.ts" />
import mongoose = require('mongoose');
import logger = require('../../logger');

export class JqData {
	page: number;
	rows: number;
	query: Object[];

	constructor(page: number, rows: number, query: Object[]){
		this.page = page;
		this.rows = rows;
		this.query = query;
	}
}

export var dataParser = (req, res, next) => {
	var page = req.query['page'];
	var max = req.query['max'];
	var sidx = req.query['sidx'];
	var order = req.query['sord'];
	var filters = req.query['filters'];

	var agg = [];

	agg.unshift({'$limit': Number(max)});
	agg.unshift({'$skip': Number((page - 1) * max)});

	var sort = {};

	if (sidx && sidx !== '' && order) {
		if(order == 'asc'){
			sort[sidx] = 1;
		} else {
			sort[sidx] = -1;
		}
		agg.unshift({'$sort': sort});
	}

	req['jqtable_query'] = agg;

	var grouped_filters = [];
	var filter_data = {};
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
		var filter_entry = {};
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

export var generalDataSourceService = (Model: mongoose.Model<any>, lazy = true) => {
	return (req, res) => {
		var page = req.query['page'];
		var max = req.query['max'];
		var parsedJqReqData = req['jqtable_query'];

		if(lazy){
			generateJqtableData(Model, new JqData(page, max, parsedJqReqData), (err, data) => {
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

export var generateJqtableData = (Model: mongoose.Model<any>, reqData: JqData, cb: Function) : any => {
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

class Operation{
	static CREATE = "add";
	static UPDATE = "edit";
	static DELETE = "del";
}

export var generalCrudService = (Model: mongoose.Model<any>) => {
	return (req, res) => {

		var data = req.body;
		var operation = data['oper'];
		var id = data['id'];

		delete data['id'];
		delete data['oper'];

		switch(operation){
			case Operation.CREATE: {
				(new Model(data)).save(respondWith(res, 201, "Unable to create entry"));
				break;
			} case Operation.UPDATE: {
				Model.update({_id: id}, data, {/* options */}, respondWith(res, 200, "Unable to update entry"));
				break;
			} case Operation.DELETE: {
				Model.remove({_id:id}, respondWith(res, 200, "Unable to renove entry"));
				break;
			} default : {
				res.status(400).send();
			}
		}
	};
};

var respondWith = (res, successStatus: number, errMessage: String) => {
	console.log("test");
	return (err: any, affectedRows?: number, raw?: any) => {
		if(!err){
			res.status(successStatus).send();
		} else {
			logger.error(err);
			res.status(500).send(errMessage);
		}
	}
}
