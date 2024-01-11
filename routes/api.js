const express = require('express');
const router = express.Router();

const api_controller = require('../controllers/apiController');

router.get('/', api_controller.index);

router.get('/shows', api_controller.show_list);

router.post('/shows/create', api_controller.show_create_post);

router.get('/shows/:id/delete', api_controller.show_delete_get);

router.post('/shows/:id/delete', api_controller.show_delete_post);


module.exports = router;
