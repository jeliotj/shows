const Show = require('../models/show');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res) => {
  const numShows = await Show.countDocuments({}).exec();
  res.json({shows: numShows});
});

exports.show_list = asyncHandler(async (req, res) => {
  const allShows = await Show.find({}, 'show_name dj day start_time end_time').exec();

  res.json(allShows);
});

exports.show_create_post = [
  
  body("show_name", "Show Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("dj", "DJ must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("day", "Day must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("start_time", "Start time must not be empty."),
  body("end_time", "End time must not be empty."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const show = new Show({
      show_name: req.body.show_name,
      dj: req.body.dj,
      day: req.body.day,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    });

    if (!errors.isEmpty()) {
      res.json({
        show,
        errors,
      });
    } else {
      await show.save();
      res.sendStatus(201);
    }
  }),
];
