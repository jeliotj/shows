const Show = require('../models/show');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  const numBooks = await Promise.all([
    Show.countDocuments({}).exec()

  ]);

  res.render('index', {
    title: 'KBMF Shows',
    show_count: numBooks,
  });
});

// Display list of all shows.
exports.show_list = asyncHandler(async (req, res, next) => {
  const allShows = await Show.find({}, 'show_name dj day')
  .sort({ show_name: 1 })
  .exec();

  res.render('show_list', { title: 'Show List', show_list: allShows });
});

exports.show_detail = asyncHandler(async (req, res, next) => {
  const show = await Promise.all([
    Show.findById(req.params.id).exec(),
  ]);

  if (show === null) {
    // No results.
    const err = new Error("Show not found");
    err.status = 404;
    return next(err);
  }

  res.render("show_detail", {
    title: show.show_name,
    show: show,
  });
});

// Display show create form on GET.
exports.show_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Show create GET");
});

// Handle show create on POST.
exports.show_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Show create POST");
});

// Display show delete form on GET.
exports.show_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Show delete GET");
});

// Handle show delete on POST.
exports.show_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Show delete POST");
});

// Display show update form on GET.
exports.show_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Show update GET");
});

// Handle show update on POST.
exports.show_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Show update POST");
});
