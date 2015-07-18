var mongoose = require('mongoose');

var AuthorSchema = new mongoose.Schema({
    _id: String,
    name: String
});

mongoose.model('Author', AuthorSchema);