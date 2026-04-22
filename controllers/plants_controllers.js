const {
  serviceAllPlants,
  servicePostPlant,
  serviceGetPlant,
  servicePatchPlant,
  serviceDeletePlant,
} = require("../services/plants_services");

const getAllPlants = async (req, res, next) => {
  const query = req.query;
  try {
    const plants = await serviceAllPlants(query);
    return res.status(200).send({ plants: plants });
  } catch (err) {
    next(err);
  }
};

const postPlant = async (req, res, next) => {
  const newPlant = req.body;
  try {
    const plant = await servicePostPlant(newPlant);
    return res.status(201).send({ plant: plant });
  } catch (err) {
    next(err);
  }
};

const getPlant = async (req, res, next) => {
  const { plant_id } = req.params;
  const plant = await serviceGetPlant(plant_id);
  return res.status(200).send({ plant: plant });
};

const patchPlant = async (req, res, next) => {
  const { plant_id } = req.params;
  const updatedInfo = req.body;
  const plant = await servicePatchPlant(plant_id, updatedInfo);
  return res.status(200).send({ plant: plant });
};

const removePlant = async (req, res, next) => {
  const { plant_id } = req.params;
  const rowCount = await serviceDeletePlant(plant_id);
  if (rowCount === 1) {
    return res.status(204).send();
  }
};
module.exports = { getAllPlants, postPlant, getPlant, patchPlant, removePlant };
