const express = require('express');
const router = express.Router();

const api_controller = require('../controllers/apiController');

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

router.get('/shows', api_controller.show_list);

router.post('/shows/create', verifyToken, api_controller.show_create_post);

router.get('/shows/:id/delete', api_controller.show_delete_get);

router.post('/shows/:id/delete', api_controller.show_delete_post);

router.get('/shows/:id/update', api_controller.show_update_get);

router.post('/shows/:id/update', api_controller.show_update_post);

router.get('/shows/:id', api_controller.show_detail);

router.post('/users/signup', api_controller.user_create_post);

router.post('/users/login', api_controller.user_login_post);

module.exports = router;
