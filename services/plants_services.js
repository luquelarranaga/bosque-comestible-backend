const fetchAllPlants = require("../models/plants_models");
const isSpeciesValid = require("../utils/isSpeciesValid");
const InvalidInputError = require("../errors/InvalidInputError");

const serviceAllPlants = async (query) => {
  let { species = null } = query;
  //check if species exist
  const speciesValidity = isSpeciesValid(species);
  if (speciesValidity === false) {
    throw new InvalidInputError("Invalid species query");
  }
  return await fetchAllPlants(species);
};

module.exports = serviceAllPlants;
