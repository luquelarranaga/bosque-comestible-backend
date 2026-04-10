const fetchAllPlants = require("../models/plants_models");

const serviceAllPlants = async () => {
  console.log("in service");
  return await fetchAllPlants();
};

module.exports = serviceAllPlants;
