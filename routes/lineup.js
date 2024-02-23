const express = require("express");
const router = express.Router();

// Require controller modules.
const show_controller = require("../controllers/showController");

// GET lineup home page.
router.get("/", show_controller.index);

// GET request for creating a Show. NOTE This must come before routes that display Show (uses id).
router.get("/show/create", show_controller.show_create_get);

// POST request for creating Show.
router.post("/show/create", show_controller.show_create_post);

// GET request to delete Show.
router.get("/show/:id/delete", show_controller.show_delete_get);

// POST request to delete Show.
router.post("/show/:id/delete", show_controller.show_delete_post);

// GET request to update Show.
router.get("/show/:id/update", show_controller.show_update_get);

// POST request to update Show.
router.post("/show/:id/update", show_controller.show_update_post);

// GET request for one Show.
router.get("/show/:id", show_controller.show_detail);

// GET request for list of all Show items.
// router.get("/shows", show_controller.show_list);
//
module.exports = router;

