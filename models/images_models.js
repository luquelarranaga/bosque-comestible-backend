const db = require("../db/connection");
const format = require("pg-format");

const updateImage = async (image_id, updatedInfo) => {
  const columns = Object.keys(updatedInfo);
  const values = Object.values(updatedInfo);

  let counter = -1;
  const setArray = columns.map((column) => {
    counter++;
    return format(`%I = %L`, column, values[counter]);
  });

  const setString = setArray.join(", ");

  const result = await db.query(
    `UPDATE images SET ${setString} WHERE image_id = $1 RETURNING *`,
    [image_id],
  );
  const { rows } = result;
  return rows[0];
};

const removeImage = async (image_id) => {
  const result = await db.query(
    `DELETE FROM images WHERE image_id = $1 RETURNING *`,
    [image_id],
  );
  const { rowCount } = result;
  return rowCount;
};

const fetchDisplayImages = async () => {
  console.log("in model");
  const result = await db.query(
    `SELECT DISTINCT ON (plant_id) image_id, plant_id, img_url, date_taken FROM images ORDER BY plant_id, date_taken DESC`,
  );
  const { rows } = result;
  return rows;
};

module.exports = {
  updateImage,
  removeImage,
  fetchDisplayImages,
};
