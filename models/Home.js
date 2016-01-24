'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HomeSchema = new Schema({
	name: String,
	area: String,
	township: String,
	address: String,
	telephone: String,
	principal: String
});

//HomeSchema.statics['test'] = (cb)=>{this.count((err, result)=>{cb(err, result)})};

const HomeModel = mongoose.model('Home', HomeSchema);
module.exports = HomeModel;
