const Show = require('../models/show');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res) => {
  const numShows = await Show.countDocuments({}).exec();
  res.json({shows: numShows});
});

exports.show_list = asyncHandler(async (req, res) => {
  const allShows = await Show.find({}, 'show_name dj day start_time end_time').exec();

  res.json(allShows);
});
