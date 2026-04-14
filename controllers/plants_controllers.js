const serviceAllPlants = require("../services/plants_services");

const getAllPlants = async (req, res) => {
  const species = req.query.species;
  console.log("query>>>", species);
  try {
    const plants = await serviceAllPlants(species);
    return res.status(200).send({ plants: plants });
  } catch (err) {
    return err;
  }
};

module.exports = getAllPlants;
