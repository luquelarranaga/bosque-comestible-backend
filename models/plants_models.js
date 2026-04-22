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

const insertPlant = async (newPlant) => {
  const result = await db.query(
    `INSERT INTO plants (species, date_planted, coordinates, body, care, img_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      newPlant.species,
      newPlant.date_planted,
      newPlant.coordinates,
      newPlant.body,
      newPlant.care,
      newPlant.img_url,
    ],
  );
  const { rows } = result;
  return rows[0];
};

const updatePlant = async (plant_id) => {
  const result = await db.query(`SELECT * FROM plants WHERE plant_id = $1`, [
    plant_id,
  ]);
  const { rows } = result;
  return rows[0];
};

module.exports = { fetchAllPlants, insertPlant, updatePlant };
