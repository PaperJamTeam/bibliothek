/// <reference path="../typings/tsd.d.ts" />
import mongoose = require('mongoose');

var AuthorSchema = new mongoose.Schema({
	name: String
});

var AuthorModel = mongoose.model('Author', AuthorSchema);
export = AuthorModel;
