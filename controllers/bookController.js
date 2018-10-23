var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');

// // Display list of all Books
// exports.index = function(req, res) {
//     res.send('Not implemented: Site home page');
// };

// Display list of all Books
exports.index = function(req, res) {
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', {title: 'Local Library Home', error: err, data: results});
    });
};

// // Display list of all Books
// exports.book_list = function(req, res) {
//     res.send('Not implemented: Book list');
// };

// Display list of all Books
exports.book_list = function(req, res, next) {
    Book.find({}, 'title author')
        .populate('author')
        .exec(function(err, list_books) {
            if(err) { return next(err); }
            // Successful, so render
            res.render('book_list', {title: 'Book List', book_list: list_books});
        });
};

// Display detail of a specific genre
exports.book_detail = function(req, res, next) {
    _id = req.params.id;

    async.parallel({
        book: function(callback) {
            Book.findById(_id).populate('author')
                .populate('genre').exec(callback);
        },
        book_instance: function(callback) {
            BookInstance.find({'book': _id}).exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }

        // No results
        if( results.book == null ) {
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }

        // Successful, so render
        res.render('book_detail', {title: 'Title', book: results.book, book_instances: results.book_instance});
    });
};

// Display Book create form on GET
exports.book_create_get = function(req, res) {
    res.send('Not implemented: Book create GET');
};

// Handle Book create on POST
exports.book_create_post = function(req, res) {
    res.send('Not implemented: Book create POST');
};

// Display Book delete form on GET
exports.book_delete_get = function(req, res) {
    res.send('Not implemented: Book delete GET');
};

// Handle Book delete on POST
exports.book_delete_post = function(req, res) {
    res.send('Not implemented: Book delete POST');
};

// Display Book update form on GET
exports.book_update_get = function(req, res) {
    res.send('Not implemented: Book update GET');
};

// Handle Book update on POST
exports.book_update_post = function(req, res) {
    res.send('Not implemented: Book update POST');
};

