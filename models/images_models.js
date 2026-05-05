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
  const result = await db.query(
    `SELECT DISTINCT ON (i.plant_id) i.image_id, i.plant_id, i.img_url, i.image_date, p.species FROM images i JOIN plants p ON i.plant_id = p.plant_id ORDER BY i.plant_id, i.image_date DESC;`,
  );
  const { rows } = result;
  return rows;
};

module.exports = {
  updateImage,
  removeImage,
  fetchDisplayImages,
};
