const { updateLog, removeLog } = require("../models/logs_models");
const InvalidInputError = require("../errors/InvalidInputError");
const NotFoundError = require("../errors/NotFoundError");
const doesItemExist = require("../utils/doesItemExist");

const servicePatchLog = async (log_id, updatedInfo) => {
  const regex = /\d/;
  if (regex.test(log_id) === false) {
    throw new InvalidInputError("Invalid log id");
  }

  const isLogFound = await doesItemExist(log_id, "log_id", "logs");
  if (isLogFound === false) {
    throw new NotFoundError("Log id not found");
  }
  const log = await updateLog(log_id, updatedInfo);
  return log;
};

const serviceDeleteLog = async (log_id) => {
  const regex = /\d/;
  if (regex.test(log_id) === false) {
    throw new InvalidInputError("Invalid log id");
  }

  const isLogFound = await doesItemExist(log_id, "log_id", "logs");
  if (isLogFound === false) {
    throw new NotFoundError("Log id not found");
  }

  const rowCount = await removeLog(log_id);
  return rowCount;
};

module.exports = {
  servicePatchLog,
  serviceDeleteLog,
};
