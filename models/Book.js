'use strict';

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
	ISBN: String,
	datePublished: String,
	EAN: String,
	bookTitle: String,
	bookCover: String,
	url: String,
	pages: String,
	publisher: {type: String, ref: 'Publisher'},
	authors: [{type: String, ref: 'Author'}]
});

const BookModel = mongoose.model('Book', BookSchema);
module.exports = BookModel;
