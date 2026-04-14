const fetchAllPlants = require("../models/plants_models");

const serviceAllPlants = async (species) => {
  return await fetchAllPlants(species);
};

module.exports = serviceAllPlants;
