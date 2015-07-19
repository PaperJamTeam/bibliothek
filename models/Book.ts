/// <reference path="../typings/tsd.d.ts" />
import mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
	_id: String,
	ISBN: String,
	productId: String,
	datePublished: String,
	EAN: String,
	bookTitle: String,
	bookCover: String,
	url: String,
	pages: String,
	publisher: {type: String, ref: 'Publisher'},
	authors: [{type: String, ref: 'Author'}]
});

mongoose.model('Book', BookSchema);
