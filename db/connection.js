const { Pool } = require("pg");

export const pool = new Pool({
  database:
    process.env.NODE_ENV === "test"
      ? "bosque_comestible_test"
      : "bosque_comestible",
});
