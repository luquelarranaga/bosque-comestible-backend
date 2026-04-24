const db = require("../db/connection");
const format = require("pg-format");

const fetchAllPlants = async (species) => {
  if (species) {
    const result = await db.query(
      `SELECT * FROM plants WHERE species = $1 ORDER BY created_at DESC`,
      [species],
    );
    const { rows } = result;

    return rows;
  } else {
    const result = await db.query(
      "SELECT * FROM plants ORDER BY species, created_at DESC",
    );
    const { rows } = result;
    return rows;
  }
};

const insertPlant = async (newPlant) => {
  const result = await db.query(
    `INSERT INTO plants (species, coordinates, created_at)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [newPlant.species, newPlant.coordinates, newPlant.created_at],
  );
  const { rows } = result;
  return rows[0];
};

const fetchPlant = async (plant_id) => {
  const result = await db.query(`SELECT * FROM plants WHERE plant_id = $1`, [
    plant_id,
  ]);
  const { rows } = result;
  return rows[0];
};

const updatePlant = async (plant_id, updatedInfo) => {
  const columns = Object.keys(updatedInfo);
  const values = Object.values(updatedInfo);

  let counter = -1;
  const setArray = columns.map((column) => {
    counter++;
    return format(`%I = %L`, column, values[counter]);
  });

  const setString = setArray.join(", ");

  const result = await db.query(
    `UPDATE plants SET ${setString} WHERE plant_id = $1 RETURNING *`,
    [plant_id],
  );
  const { rows } = result;
  return rows[0];
};

const deletePlant = async (plant_id) => {
  const result = await db.query(
    `DELETE FROM plants WHERE plant_id = $1 RETURNING *`,
    [plant_id],
  );
  const { rowCount } = result;
  return rowCount;
};

module.exports = {
  fetchAllPlants,
  insertPlant,
  fetchPlant,
  updatePlant,
  deletePlant,
};
