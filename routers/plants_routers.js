const express = require("express");
const router = express.Router();
const {
  getAllPlants,
  postPlant,
  getPlant,
  patchPlant,
  removePlant,
  getImages,
  postImages,
  getLogs,
  postLog,
} = require("../controllers/plants_controllers");
const handleInvalidMethods = require("../utils/handleInvalidMethods");

router.route("/").get(getAllPlants).post(postPlant).all(handleInvalidMethods);

router
  .route("/:plant_id")
  .get(getPlant)
  .patch(patchPlant)
  .delete(removePlant)
  .all(handleInvalidMethods);

router
  .route("/:plant_id/images")
  .get(getImages)
  .post(postImages)
  .all(handleInvalidMethods);

router
  .route("/:plant_id/logs")
  .get(getLogs)
  .post(postLog)
  .all(handleInvalidMethods);

module.exports = router;
