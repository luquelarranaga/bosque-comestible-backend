const fetchAllPlants = require("../models/plants_models");
const isSpeciesValid = require("../utils/isSpeciesValid");
const InvalidInputError = require("../errors/InvalidInputError");
const doesSpeciesExist = require("../utils/doesSpeciesExist");
const NotFoundError = require("../errors/NotFoundError");

const serviceAllPlants = async (query) => {
  let { species = null } = query;

  const speciesValidity = isSpeciesValid(species);
  if (speciesValidity === false) {
    throw new InvalidInputError("Invalid species query");
  }

  const speciesExists = await doesSpeciesExist(species);
  if (speciesExists === false) {
    console.log("in error");
    throw new NotFoundError("Species not found");
  }

  return await fetchAllPlants(species);
};

module.exports = serviceAllPlants;
