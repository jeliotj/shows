const Show = require('../models/show');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display list of all shows.
exports.show_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Show list");
});

// Display detail page for a specific show.
exports.show_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Show detail: ${req.params.id}`);
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
