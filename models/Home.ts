/// <reference path="../typings/tsd.d.ts" />
import mongoose = require('mongoose');

var HomeSchema = new mongoose.Schema({
	_id: String,
	name: String,
	area: String,
	township: String,
	address: String,
	telephone: String,
	principal: String
});

var HomeModel = mongoose.model('Home', HomeSchema);
export = HomeModel;
