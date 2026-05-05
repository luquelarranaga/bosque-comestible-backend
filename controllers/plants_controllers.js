const { get } = require("../app");
const {
  serviceAllPlants,
  servicePostPlant,
  serviceGetPlant,
  servicePatchPlant,
  serviceDeletePlant,
  serviceGetImages,
  servicePostImages,
  serviceGetLogs,
  servicePostLog,
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
    return res.status(201).send({ newPlant: plant });
  } catch (err) {
    next(err);
  }
};

const getPlant = async (req, res, next) => {
  const { plant_id } = req.params;

  try {
    const plant = await serviceGetPlant(plant_id);
    return res.status(200).send({ plant: plant });
  } catch (err) {
    next(err);
  }
};

const patchPlant = async (req, res, next) => {
  const { plant_id } = req.params;
  const updatedInfo = req.body;

  try {
    const plant = await servicePatchPlant(plant_id, updatedInfo);
    return res.status(200).send({ plant: plant });
  } catch (err) {
    next(err);
  }
};

const removePlant = async (req, res, next) => {
  const { plant_id } = req.params;

  try {
    const rowCount = await serviceDeletePlant(plant_id);
    if (rowCount === 1) {
      return res.status(204).send();
    }
  } catch (err) {
    next(err);
  }
};

const getImages = async (req, res, next) => {
  const { plant_id } = req.params;

  try {
    const images = await serviceGetImages(plant_id);
    return res.status(200).send({ images: images });
  } catch (err) {
    next(err);
  }
};

const postImages = async (req, res, next) => {
  const newImages = req.body;
  try {
    const images = await servicePostImages(newImages);
    return res.status(201).send({ images: images });
  } catch (err) {
    next(err);
  }
};

const getLogs = async (req, res, next) => {
  const { plant_id } = req.params;

  try {
    const logs = await serviceGetLogs(plant_id);
    return res.status(200).send({ logs: logs });
  } catch (err) {
    next(err);
  }
};

const postLog = async (req, res, next) => {
  const newLog = req.body;
  try {
    const log = await servicePostLog(newLog);
    return res.status(201).send({ log: log });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPlants,
  postPlant,
  getPlant,
  patchPlant,
  removePlant,
  getImages,
  postImages,
  getLogs,
  postLog,
};
