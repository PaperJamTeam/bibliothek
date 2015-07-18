var mongoose = require('mongoose');

var PublisherSchema = new mongoose.Schema({
    _id: String,
    name: String
});

mongoose.model('Publisher', PublisherSchema);