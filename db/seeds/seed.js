const db = require("../connection");
const format = require("pg-format");

const seed = async ({ plantsData, logsData, imagesData }) => {
  await db.query("DROP TABLE IF EXISTS logs");
  await db.query("DROP TABLE IF EXISTS images");
  await db.query("DROP TABLE IF EXISTS plants");

  await db.query(`
    CREATE TABLE plants (
    plant_id SERIAL PRIMARY KEY,
    species VARCHAR NOT NULL,
    coordinates VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

  await db.query(`
    CREATE TABLE logs (
    log_id SERIAL PRIMARY KEY,
    plant_id INT REFERENCES plants(plant_id) ON DELETE CASCADE,
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body VARCHAR
)`);

  await db.query(`
    CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    plant_id INT REFERENCES plants(plant_id) ON DELETE CASCADE,
    image_date VARCHAR,
    img_url VARCHAR
)`);

  const formattedPlants = plantsData.map((plant) => {
    return [plant.species, plant.coordinates, plant.created_at];
  });

  const plantsQueryStr = format(
    `INSERT INTO plants
    (species, coordinates, created_at)
    VALUES %L
    RETURNING *;`,
    formattedPlants,
  );

  await db.query(plantsQueryStr);

  const formattedLogs = logsData.map((log) => {
    return [log.plant_id, log.log_date, log.body];
  });

  const logsQueryStr = format(
    `INSERT INTO logs
    (plant_id, log_date, body)
    VALUES %L
    RETURNING *;`,
    formattedLogs,
  );

  await db.query(logsQueryStr);

  const formattedImages = imagesData.map((image) => {
    return [image.plant_id, image.image_date, image.img_url];
  });

  const imagesQueryStr = format(
    `INSERT INTO images
    (plant_id, image_date, img_url)
    VALUES %L
    RETURNING *;`,
    formattedImages,
  );

  await db.query(imagesQueryStr);
};

module.exports = seed;
