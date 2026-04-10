function handleInvalidMethods(req, res, next) {
  return res.status(405).send({ msg: "Method not allowed" });
}

module.exports = handleInvalidMethods;
