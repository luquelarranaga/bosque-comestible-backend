const serviceAllPlants = require("../services/plants_services");

const getAllPlants = async (req, res, next) => {
  const query = req.query;
  try {
    const plants = await serviceAllPlants(query);
    return res.status(200).send({ plants: plants });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllPlants;
