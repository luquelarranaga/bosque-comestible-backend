const {
  serviceAllPlants,
  servicePostPlant,
  servicePatchPlant,
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

const patchPlant = async (req, res, next) => {
  const { plant_id } = req.params;
  const updatedInfo = req.body;
  const plant = await servicePatchPlant(plant_id, updatedInfo);
  return res.status(200).send({ plant: plant });
};
module.exports = { getAllPlants, postPlant, patchPlant };
