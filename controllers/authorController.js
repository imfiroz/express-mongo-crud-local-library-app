var Author = require('../models/author');
var Book = require('../models/book');

var async   = require('async');

// Display list of all Authors
exports.author_list = function(req, res, next) {

    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function(err, list_authors) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('author_list', {title: 'Author List', author_list: list_authors})
        });
};

// Display detail page for a specific Author
exports.author_detail = function(req, res, next) {
    _id = req.params.id;

    async.parallel({
        author: function(callback) {
            Author.findById(_id).exec(callback);
        },
        author_books: function(callback) {
            Book.find({'author': _id}, 'title summary').exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }

        // No results
        if( results.author == null ) {
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }

        // Successful, so render
        res.render('author_detail', {title: 'Author Detail', author: results.author, author_books: results.author_books});
    });
};

// Display Author create form on GET
exports.author_create_get = function(req, res) {
    res.send('Not implemented: Author Create GET');
};

// Handle Author create on POST
exports.author_create_post = function(req, res) {
    res.send('Not implemented: Author create POST');
};

// Display Author delete form on GET
exports.author_delete_get = function(req, res) {
    res.send('Not implemented: Author delete GET');
};

// Handle Author delete on POST
exports.author_delete_post = function(req, res) {
    res.send('Not implemented: Author delete on POST');
};

// Display Author update on GET
exports.author_update_get = function(req, res) {
    res.send('Not implemented: Author update GET');
};

// Handle Author update on POST
exports.author_update_post = function(req, res) {
    res.send('Not implemented: Author update on POST');
};
