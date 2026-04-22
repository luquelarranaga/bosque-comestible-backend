const express = require("express");
const router = express.Router();
const {
  getAllPlants,
  postPlant,
  patchPlant,
} = require("../controllers/plants_controllers");
const handleInvalidMethods = require("../utils/handleInvalidMethods");

router.route("/").get(getAllPlants).post(postPlant).all(handleInvalidMethods);

router.route("/:plant_id").patch(patchPlant).all(handleInvalidMethods);

module.exports = router;
