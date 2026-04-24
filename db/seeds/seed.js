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
    date_posted VARCHAR NOT NULL,
    body VARCHAR
)`);

  await db.query(`
    CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    plant_id INT REFERENCES plants(plant_id) ON DELETE CASCADE,
    date_taken VARCHAR NOT NULL,
    img_url VARCHAR NOT NULL
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
    return [log.plant_id, log.date_posted, log.body];
  });

  const logsQueryStr = format(
    `INSERT INTO logs
    (plant_id, date_posted, body)
    VALUES %L
    RETURNING *;`,
    formattedLogs,
  );

  await db.query(logsQueryStr);

  const formattedImages = imagesData.map((image) => {
    return [image.plant_id, image.date_taken, image.img_url];
  });

  const imagesQueryStr = format(
    `INSERT INTO images
    (plant_id, date_taken, img_url)
    VALUES %L
    RETURNING *;`,
    formattedImages,
  );

  await db.query(imagesQueryStr);
};

module.exports = seed;
