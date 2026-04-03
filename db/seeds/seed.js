import db from "../connection";
import format from "pg-format";

export const seed = async ({ plants }) => {
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
};

const insertPlantsQuery = format(
  `INSERT INTO plants (species, date_planted, coordinates, body, care, img_url) VALUE %L RETURNING *;`,
  plants.map(({ species, date_planted, coordinates, body, care, img_url }) => [
    species,
    date_planted,
    coordinates,
    body,
    care,
    img_url,
  ]),
);
await db.query(insertPlantsQuery);
