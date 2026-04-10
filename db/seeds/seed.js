const db = require("../connection");
const format = require("pg-format");

const seed = async (plants) => {
  await db.query("DROP TABLE IF EXISTS plants");

  await db.query(`
    CREATE TABLE plants (
    plant_id SERIAL PRIMARY KEY,
    species VARCHAR NOT NULL,
    date_planted TIMESTAMP,
    coordinates VARCHAR,
    body VARCHAR,
    care VARCHAR,
    img_url VARCHAR
)`);

  const formattedPlants = plants.map((plant) => {
    return [
      plant.species,
      plant.date_planted,
      plant.coordinates,
      plant.body,
      plant.care,
      plant.img_url,
    ];
  });

  const plantsQueryStr = format(
    `INSERT INTO plants
    (species, date_planted, coordinates, body, care, img_url)
    VALUES %L
    RETURNING *;`,
    formattedPlants,
  );

  await db.query(plantsQueryStr);
};

module.exports = seed;
