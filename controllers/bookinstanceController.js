var BookInstance = require('../models/bookinstance');

// // Display list of all BookInstances
// exports.bookinstance_list = function(req, res) {
//     res.send('Not implemented: BookInstance List');
// };

// Display list of all BookInstances
exports.bookinstance_list = function(req, res, next) {
    BookInstance.find()
        .populate('book')
        .exec(function(err, list_bookinstances) {
           if(err)  { return next(err); }
            res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances});
        });
};

// Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res) {
    // _id = req.params.id;

    BookInstance.findById(req.params.id).populate('book')
        .exec(function(err, bookinstance) {
            if(err) {return next(er);}

            // No results
            if(bookinstance == null) {
                var err     = new Error('Book copy not found');
                err.status  = 404;
                return next(err);
            }

            // Successful, so render
            res.render('bookinstance_detail', {title: 'Book:', bookinstance: bookinstance});
        });
};

// Display BookInstances create form on GET
exports.bookinstance_create_get = function(req, res) {
    res.send('Not implemented: BookInstance create GET');
};

// Handle BookInstances create on POST
exports.bookinstance_create_post = function(req, res) {
    res.send('Not implemented: BookInstance create POST');
};

// Display BookInstances delete form on GET
exports.bookinstance_delete_get = function(req, res) {
    res.send('Not implemented: BookInstance delete GET');
};

// Handle BookInstances delete on POST
exports.bookinstance_delete_post = function(req, res) {
    res.send('Not implemented: BookInstance delete POST');
};

// Display BookInstances update form on GET
exports.bookinstance_update_get = function(req, res) {
    res.send('Not implemented: BookInstance update GET');
};

// Handle BookInstances update on POST
exports.bookinstance_update_post = function(req, res) {
    res.send('Not implemented: BookInstance update POST');
};
