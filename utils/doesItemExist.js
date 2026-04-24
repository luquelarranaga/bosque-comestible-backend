const db = require("../db/connection");
const format = require("pg-format");

async function doesItemExist(item, columnName, tableName) {
  if (item === null) return true;

  const result = await db.query(format(`SELECT * FROM %I`, tableName));
  const { rows } = result;
  const existingPlantIds = rows.map((row) => String(row[columnName]));

  return existingPlantIds.includes(item);
}

module.exports = doesItemExist;
