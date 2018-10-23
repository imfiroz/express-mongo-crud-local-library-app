var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

// Display list of all Genres
exports.genre_list = function(req, res, next) {

    Genre.find()
        .sort([['name', 'ascending']])
        .exec(function(err, list_genres) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
        });
};

// Display detail of a specific genre
exports.genre_detail = function(req, res, next) {
    _id = req.params.id;
    async.parallel({
        genre: function(callback) {
            Genre.findById(_id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({'genre': _id}).exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err); }
        // No results
        if( results.genre == null ) {
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
    });
};

// Display Genre create form on GET
exports.genre_create_get = function(req, res) {
    res.send('Not implemented: Genre create GET');
};

// Handle Genre create on POST
exports.genre_create_post = function(req, res) {
    res.send('Not implemented: Genre create POST');
};

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res) {
    res.send('Not implemented: Genre delete GET');
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res) {
    res.send('Not implemented: Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res) {
    res.send('Not implemented: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res) {
    res.send('Not implemented: Genre update POST');
};

