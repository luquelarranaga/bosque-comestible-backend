const { Pool } = require("pg");

const pool = new Pool({
  database:
    process.env.NODE_ENV === "test"
      ? "bosque_comestible_test"
      : "bosque_comestible",
});

module.exports = pool;
