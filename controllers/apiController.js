const Show = require('../models/show');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

exports.show_list = asyncHandler(async (req, res) => {
  const allShows = await Show.find(
    {},
    'show_name dj day start_time end_time',
  ).exec();

  res.json(allShows);
});

exports.show_detail = asyncHandler(async (req, res, next) => {
  const [show] = await Promise.all([Show.findById(req.params.id).exec()]);

  if (show === null) {
    // No results.
    const err = new Error('Show not found');
    err.status = 404;
    return next(err);
  }

  res.json({ show });
});

exports.show_create_post = [
  (req, res, next) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.authData = authData;
        next();
      }
    });
  },
  body('show_name', 'Show Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('dj', 'DJ must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('day', 'Day must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('start_time', 'Start time must not be empty.'),
  body('end_time', 'End time must not be empty.'),

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
      res.json({
        message: 'Success',
        data: req.authData,
      });
    }
  }),
];

exports.show_delete_get = asyncHandler(async (req, res, next) => {
  const [show] = await Promise.all([Show.findById(req.params.id).exec()]);

  if (show === null) {
    res.send('No show found!');
  }

  res.json({ show });
});

exports.show_delete_post = asyncHandler(async (req, res, next) => {
  await Show.findByIdAndDelete(req.body.showid);
  res.send('Successfully Deleted Show');
});

// Display show update form on GET.
exports.show_update_get = asyncHandler(async (req, res, next) => {
  const [show] = await Promise.all([Show.findById(req.params.id).exec()]);

  if (show === null) {
    const err = new Error('Show Not Found');
    err.status = 404;
    return next(err);
  }

  res.json({ show });
});

// Handle show update on POST.
exports.show_update_post = [
  body('show_name', 'Show name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('dj', 'Dj name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('day', 'Day must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('start_time', 'Start time must not be empty'),
  body('end_time', 'End time must not be empty'),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Show object with escaped/trimmed data and old id.
    const show = new Show({
      show_name: req.body.show_name,
      dj: req.body.dj,
      day: req.body.day,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.json({
        show,
        errors,
      });

      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedShow = await Show.findByIdAndUpdate(req.params.id, show, {});
      res.json(show);
    }
  }),
];

exports.user_create_post = [
  body('username')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Username must be at least 6 characters.')
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .escape(),
  body('password')
    .trim()
    .isStrongPassword()
    .withMessage(
      'Password must be at least 8 characters, including at least one number, one uppercase letter, one lowercase letter, and one symbol',
    )
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors });
    }
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        throw err;
      } else {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        user.save();
        res.sendStatus(200);
      }
    });
  }),
];

exports.user_login_post = [
  passport.authenticate('local', {
    failureMessage: true,
  }),
  function (req, res) {
    jwt.sign({ user: req.user }, 'secretkey', (err, token) => {
      res.json({
        token,
      });
    });
  },
];
