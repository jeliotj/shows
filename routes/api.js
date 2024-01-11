const express = require('express');
const router = express.Router();

const api_controller = require('../controllers/apiController');

router.get('/', api_controller.index);

router.get('/shows', api_controller.show_list);

router.post('/shows/create', api_controller.show_create_post);

module.exports = router;
