const express = require("express");
const router = express.Router();
const getAllPlants = require("../controllers/plants_controllers");

//add handle invalid methods.
router.route("/").get(getAllPlants);

module.exports = router;
