function isSpeciesValid(species) {
  if (species === null) return true;
  const invalidChars = /[^\w\s]|\d/g;
  return invalidChars.test(species) ? false : true;
}

module.exports = isSpeciesValid;
