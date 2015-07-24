/// <reference path="../typings/tsd.d.ts" />
import mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
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

var BookModel = mongoose.model('Book', BookSchema);
export = BookModel;
