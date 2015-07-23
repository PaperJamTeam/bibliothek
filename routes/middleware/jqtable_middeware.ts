/// <reference path="../../typings/tsd.d.ts" />

var jqtable = (req, res, next) => {
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
	console.log(agg);

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

export = jqtable;
