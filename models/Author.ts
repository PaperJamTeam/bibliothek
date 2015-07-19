/// <reference path="../typings/tsd.d.ts" />
import mongoose = require('mongoose');

var AuthorSchema = new mongoose.Schema({
	_id: String,
	NAME: String
});

mongoose.model('Author', AuthorSchema);
