const serviceAllPlants = require("../services/plants_services");

const getAllPlants = async (req, res) => {
  console.log("before trying in controller");
  try {
    console.log("in controller");
    const plants = await serviceAllPlants();
    return res.status(200).send({ plants: plants });
  } catch (err) {
    return err;
  }
};

module.exports = getAllPlants;
