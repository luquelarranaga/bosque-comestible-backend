const db = require("../db/connection");

async function doesPlantIdExist(plant_id) {
  const result = await db.query(`SELECT * FROM plants`);
  const { rows } = result;
  const existingPlantIds = rows.map((row) => String(row.plant_id));

  return existingPlantIds.includes(plant_id);
}

module.exports = doesPlantIdExist;
