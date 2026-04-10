const express = require("express");
const router = express.Router();
const getAllPlants = require("../controllers/plants_controllers");
const handleInvalidMethods = require("../utils/handleInvalidMethods");

//add handle invalid methods.
router.route("/").get(getAllPlants).all(handleInvalidMethods);

module.exports = router;
