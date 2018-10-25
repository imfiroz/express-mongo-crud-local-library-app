var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');

// Validation for forms
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

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

// Display book create form on GET.
exports.book_create_get = function(req, res, next) {

    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
    });

};

// Handle Book create on POST
// Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];

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

