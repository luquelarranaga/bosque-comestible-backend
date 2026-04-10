const db = require("../db/connection");

const fetchAllPlants = async () => {
  console.log("in model");
  const result = await db.query("SELECT * FROM plants");
  const { rows } = result;
  console.log("rows>>>", rows);
  return rows;
};

module.exports = fetchAllPlants;
