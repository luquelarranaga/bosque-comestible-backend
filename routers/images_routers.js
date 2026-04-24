const express = require("express");
const router = express.Router();
const {
  patchImage,
  deleteImage,
} = require("../controllers/images_controllers");
const handleInvalidMethods = require("../utils/handleInvalidMethods");

router
  .route("/:image_id")
  .patch(patchImage)
  .delete(deleteImage)
  .all(handleInvalidMethods);

module.exports = router;
