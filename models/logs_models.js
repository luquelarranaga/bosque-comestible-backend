const db = require("../db/connection");
const format = require("pg-format");

const updateLog = async (log_id, updatedInfo) => {
  const result = await db.query(
    `UPDATE logs SET body = $1 WHERE log_id = $2 RETURNING *`,
    [updatedInfo.body, log_id],
  );
  const { rows } = result;
  return rows[0];
};

const removeLog = async (log_id) => {
  const result = await db.query(
    `DELETE FROM logs WHERE log_id = $1 RETURNING *`,
    [log_id],
  );
  const { rowCount } = result;
  return rowCount;
};

module.exports = {
  updateLog,
  removeLog,
};
