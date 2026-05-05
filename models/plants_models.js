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
  const {
    species,
    coordinates,
    created_at,
    log_date,
    body,
    image_date,
    img_url,
  } = newPlant;

  console.log("log date and body >> ", log_date, body);

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const plantResult = await client.query(
      `INSERT INTO plants (species, coordinates, created_at) 
       VALUES ($1, $2, $3) RETURNING *`,
      [species, coordinates, created_at],
    );
    const createdPlant = plantResult.rows[0];
    const newPlantId = createdPlant.plant_id;

    const logResult = await client.query(
      `INSERT INTO logs (plant_id, body, log_date) 
       VALUES ($1, $2, $3) RETURNING *`,
      [newPlantId, body, log_date],
    );

    const imageQueries = img_url.map((url) => {
      return client.query(
        `INSERT INTO images (plant_id, img_url, image_date) 
           VALUES ($1, $2, $3) RETURNING *`,
        [newPlantId, url, image_date],
      );
    });
    const imageResult = await Promise.all(imageQueries);

    await client.query("COMMIT");
    return {
      plant: createdPlant,
      log: logResult.rows[0],
      images: imageResult.map((res) => res.rows[0]),
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
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

const fetchImages = async (plant_id) => {
  const result = await db.query(
    `SELECT * FROM images WHERE plant_id = $1 ORDER BY image_date DESC`,
    [plant_id],
  );
  const { rows } = result;
  return rows;
};

const insertImages = async (newImages) => {
  const formattedImages = newImages.map((image) => [
    image.plant_id,
    image.image_date,
    image.img_url,
  ]);

  const queryStr = format(
    `INSERT INTO images (plant_id, image_date, img_url) VALUES %L RETURNING *`,
    formattedImages,
  );

  const { rows } = await db.query(queryStr);
  return rows;
};

const fetchLogs = async (plant_id) => {
  const result = await db.query(
    `SELECT * FROM logs WHERE plant_id = $1 ORDER BY log_date DESC`,
    [plant_id],
  );
  const { rows } = result;
  return rows;
};

const insertLog = async (newLog) => {
  const result = await db.query(
    `INSERT INTO logs (plant_id, log_date, body) VALUES ($1, $2, $3) RETURNING *`,
    [newLog.plant_id, newLog.log_date, newLog.body],
  );

  const { rows } = result;
  return rows[0];
};

module.exports = {
  fetchAllPlants,
  insertPlant,
  fetchPlant,
  updatePlant,
  deletePlant,
  fetchImages,
  insertImages,
  fetchLogs,
  insertLog,
};
