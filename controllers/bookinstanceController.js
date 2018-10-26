let BookInstance    = require('../models/bookinstance')
let Book            = require('../models/book')

const {body, validationResult} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')

// Display list of all BookInstances
exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
        .populate('book')
        .exec(function(err, list_bookinstances) {
           if(err)  { return next(err) }
            res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances})
        })
}

// Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res) {
    // _id = req.params.id

    BookInstance.findById(req.params.id).populate('book')
        .exec(function(err, bookinstance) {
            if(err) {return next(er)}

            // No results
            if(bookinstance == null) {
                let err     = new Error('Book copy not found')
                err.status  = 404
                return next(err)
            }

            // Successful, so render
            res.render('bookinstance_detail', {title: 'Book:', bookinstance: bookinstance})
        })
}

// Display BookInstances create form on GET
exports.bookinstance_create_get = function(req, res, next) {
    Book.find({}, 'title').exec(function(err, books) {
        if(err) {return next(err)}

        // Successful, so render
        res.render('bookinstance_form', {title: 'Create Book Instance', book_list: books})
    })
}

// Handle BookInstances create on POST
exports.bookinstance_create_post = [
    // Validate fields
    body('book', 'Book must be specified').isLength({min: 1}).trim(),
    body('imprint', 'Imprint must be specified').isLength({min: 1}).trim(),
    body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),

    // Sanitize fields
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').trim().escape(),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract the validation errors from a request
        const errors = validationResult(req)

        // Create a BookInstance object with escaped and trimmed data
        let bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        })

        if(!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error message
            Book.find({}, 'title').exec(function(err, books) {
                if(err) {return next(err)}

                // Successful, so render
                res.render('bookinstance_form', {title: 'Create Book Instance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance})
            })

            return
        } else {
            // Data from form is valid
            bookinstance.save(function(err) {
                if(err) {return next(err)}

                // Successful, so render
                res.redirect(bookinstance.url)
            })
        }
    }
]

// Display BookInstances delete form on GET
exports.bookinstance_delete_get = function(req, res) {
    res.send('Not implemented: BookInstance delete GET')
}

// Handle BookInstances delete on POST
exports.bookinstance_delete_post = function(req, res) {
    res.send('Not implemented: BookInstance delete POST')
}

// Display BookInstances update form on GET
exports.bookinstance_update_get = function(req, res) {
    res.send('Not implemented: BookInstance update GET')
}

// Handle BookInstances update on POST
exports.bookinstance_update_post = function(req, res) {
    res.send('Not implemented: BookInstance update POST')
}
