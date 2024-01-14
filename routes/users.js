var express = require('express');
var router = express.Router();

const users_controller = require('../controllers/userController');

router.post('/login', users_controller.user_login_post);
router.get('/signup', users_controller.user_create_get);
router.post('/signup', users_controller.user_create_post);
router.get('/login', users_controller.user_login_get);
router.get('/logout', users_controller.user_logout_get);

module.exports = router;
