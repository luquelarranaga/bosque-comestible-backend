const express = require("express");
const router = express.Router();
const {
  patchImage,
  deleteImage,
  getDisplayImages,
} = require("../controllers/images_controllers");
const handleInvalidMethods = require("../utils/handleInvalidMethods");

router.route("/display_images").get(getDisplayImages).all(handleInvalidMethods);

router
  .route("/:image_id")
  .patch(patchImage)
  .delete(deleteImage)
  .all(handleInvalidMethods);

module.exports = router;
