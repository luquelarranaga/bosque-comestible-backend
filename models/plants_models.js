const db = require("../db/connection");

const fetchAllPlants = async (species) => {
  if (species) {
    const result = await db.query(`SELECT * FROM plants WHERE species = $1`, [
      species,
    ]);
    const { rows } = result;
    return rows;
  } else {
    const result = await db.query("SELECT * FROM plants");
    const { rows } = result;
    return rows;
  }
};

module.exports = fetchAllPlants;
