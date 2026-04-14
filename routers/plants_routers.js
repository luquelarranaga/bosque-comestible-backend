const express = require("express");
const router = express.Router();
const {
  getAllPlants,
  postPlant,
} = require("../controllers/plants_controllers");
const handleInvalidMethods = require("../utils/handleInvalidMethods");

router.route("/").get(getAllPlants).post(postPlant).all(handleInvalidMethods);

module.exports = router;
