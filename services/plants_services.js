const {
  fetchAllPlants,
  insertPlant,
  updatePlant,
} = require("../models/plants_models");
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
    throw new NotFoundError("Species not found");
  }

  return await fetchAllPlants(species);
};

const servicePostPlant = async (newPlant) => {
  const plant = await insertPlant(newPlant);
  return plant;
};

const servicePatchPlant = async (plant_id) => {
  const plant = await updatePlant(plant_id);
  return plant;
};

module.exports = { serviceAllPlants, servicePostPlant, servicePatchPlant };
