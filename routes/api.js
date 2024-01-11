const express = require('express');
const router = express.Router();

const api_controller = require('../controllers/apiController');

router.get('/shows', api_controller.show_list);

router.post('/shows/create', api_controller.show_create_post);

router.get('/shows/:id/delete', api_controller.show_delete_get);

router.post('/shows/:id/delete', api_controller.show_delete_post);

router.get('/shows/:id/update', api_controller.show_update_get);

router.post('/shows/:id/update', api_controller.show_update_post);

router.get('/shows/:id', api_controller.show_detail);

module.exports = router;
