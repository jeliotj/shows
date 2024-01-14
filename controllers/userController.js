const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.user_login_get = asyncHandler(async (req, res, next) => {
  res.render('login', {
    title: 'KBMF Show App Login',
  });
});

exports.user_create_get = asyncHandler(async (req, res, next) => {
  res.render('signup', {
    title: 'User Signup'
  });
});

exports.user_create_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage('First Name may only contain letters and numbers')
    .escape(),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage('Last Name may only contain letters and numbers')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .escape(),
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
      res.send({ errors });
    }
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        throw err;
      } else {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
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
    res.redirect('/lineup');
  },
];

exports.user_logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/lineup");
  });
};
