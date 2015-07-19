/// <reference path="../typings/tsd.d.ts" />
import mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	_id: String,
	name: String,
	email: String,
	password: String,
	role: String
});

var UserModel = mongoose.model('User', UserSchema);
export = UserModel;
