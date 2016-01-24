'use strict';

const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
	name: String
});

const AuthorModel = mongoose.model('Author', AuthorSchema);
module.exports = AuthorModel;
