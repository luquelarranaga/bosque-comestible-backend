const {
  fetchAllPlants,
  insertPlant,
  fetchPlant,
  updatePlant,
  deletePlant,
  fetchImages,
  insertImages,
  fetchLogs,
  insertLog,
} = require("../models/plants_models");
const isSpeciesValid = require("../utils/isSpeciesValid");
const InvalidInputError = require("../errors/InvalidInputError");
const doesSpeciesExist = require("../utils/doesSpeciesExist");
const NotFoundError = require("../errors/NotFoundError");
const doesPlantIdExist = require("../utils/doesPlantIdExist");

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

const serviceGetPlant = async (plant_id) => {
  const regex = /\d/;
  if (regex.test(plant_id) === false) {
    throw new InvalidInputError("Invalid plant id");
  }

  const plantIdValidity = await doesPlantIdExist(plant_id);
  if (plantIdValidity === false) {
    throw new NotFoundError("Plant id not found");
  }

  const plant = await fetchPlant(plant_id);
  return plant;
};

const servicePatchPlant = async (plant_id, updatedInfo) => {
  const regex = /\d/;
  if (regex.test(plant_id) === false) {
    throw new InvalidInputError("Invalid plant id");
  }

  const plantIdValidity = await doesPlantIdExist(plant_id);
  if (plantIdValidity === false) {
    throw new NotFoundError("Plant id not found");
  }

  const plant = await updatePlant(plant_id, updatedInfo);
  return plant;
};

const serviceDeletePlant = async (plant_id) => {
  const regex = /\d/;
  if (regex.test(plant_id) === false) {
    throw new InvalidInputError("Invalid plant id");
  }

  const plantIdValidity = await doesPlantIdExist(plant_id);
  if (plantIdValidity === false) {
    throw new NotFoundError("Plant id not found");
  }

  const rowCount = await deletePlant(plant_id);
  return rowCount;
};

const serviceGetImages = async (plant_id) => {
  const regex = /\d/;
  if (regex.test(plant_id) === false) {
    throw new InvalidInputError("Invalid plant id");
  }

  const plantIdValidity = await doesPlantIdExist(plant_id);
  if (plantIdValidity === false) {
    throw new NotFoundError("Plant id not found");
  }

  const images = await fetchImages(plant_id);
  return images;
};

const servicePostImages = async (newImages) => {
  const images = await insertImages(newImages);
  return images;
};

const serviceGetLogs = async (plant_id) => {
  const regex = /\d/;
  if (regex.test(plant_id) === false) {
    throw new InvalidInputError("Invalid plant id");
  }

  const plantIdValidity = await doesPlantIdExist(plant_id);
  if (plantIdValidity === false) {
    throw new NotFoundError("Plant id not found");
  }

  const logs = await fetchLogs(plant_id);
  return logs;
};

const servicePostLog = async (newLog) => {
  const log = await insertLog(newLog);
  return log;
};

module.exports = {
  serviceAllPlants,
  servicePostPlant,
  serviceGetPlant,
  servicePatchPlant,
  serviceDeletePlant,
  serviceGetImages,
  servicePostImages,
  serviceGetLogs,
  servicePostLog,
};
