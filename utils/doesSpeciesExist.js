const db = require("../db/connection");

async function doesSpeciesExist(species) {
  if (species === null) return true;
  const result = await db.query(`SELECT species FROM plants`);
  const { rows } = result;
  const existingSpecies = rows.map((row) => row.species);

  return existingSpecies.includes(species);
}

module.exports = doesSpeciesExist;
