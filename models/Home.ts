/// <reference path="../typings/tsd.d.ts" />
import mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HomeSchema = new Schema({
	_id: String,
	name: String,
	area: String,
	township: String,
	address: String,
	telephone: String,
	principal: String
});

//HomeSchema.statics['test'] = (cb)=>{this.count((err, result)=>{cb(err, result)})};

var HomeModel = mongoose.model('Home', HomeSchema);
export = HomeModel;
