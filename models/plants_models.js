const db = require("../db/connection");

const fetchAllPlants = async (species) => {
  if (species) {
    const result = await db.query(
      `SELECT * FROM plants WHERE species = $1 ORDER BY date_planted DESC`,
      [species],
    );
    const { rows } = result;
    return rows;
  } else {
    const result = await db.query(
      "SELECT * FROM plants ORDER BY species, date_planted DESC",
    );
    const { rows } = result;
    return rows;
  }
};

module.exports = fetchAllPlants;
