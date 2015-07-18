var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bibliothek');

//models
require('./../models/Book');
require('./../models/Publisher');
require('./../models/Author');

var Books = mongoose.model('Book');
var Authors = mongoose.model('Author');
var Publishers = mongoose.model('Publisher');

//this will get the book document as-is
Books.findById("5492bd413d9fb70bfc1e719a", function(err, book){
    console.log(book);
});

//this will replace publisher field with it's document from the publishers collections
Books.findById("5492bd413d9fb70bfc1e719a").populate("publisher").exec(function(err, book){
    console.log(book);
});

//same as above, including authors
Books.findById("5492bd413d9fb70bfc1e719a").populate("publisher").populate("authors").exec(function(err, book){
    console.log(book);
});

//all books by author
Authors.findOne({name:"Иван Вазов"}, function(err, author){
    console.log("All books by " + author);
    Books.find({authors:author['_id']}).populate("publisher").populate("authors").exec(function(err, books){
        console.log(books);
    })
});

//all books by publisher
Publishers.findOne({name: "СофтПрес"}, function(err, publisher){
    console.log(publisher);
    console.log("All books by " + publisher);
    Books.find({publisher:publisher['_id']}).populate("publisher").populate("authors").exec(function(err, books){
        console.log(books);
    })
});
