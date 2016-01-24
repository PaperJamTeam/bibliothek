'use strict';

const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
	name: String
});

const PublisherModel = mongoose.model('Publisher', PublisherSchema);
module.exports = PublisherModel;
