const { get } = require("../app");
const {
  servicePatchLog,
  serviceDeleteLog,
} = require("../services/logs_services");

const patchLog = async (req, res, next) => {
  const { log_id } = req.params;
  const updatedInfo = req.body;

  try {
    const log = await servicePatchLog(log_id, updatedInfo);
    return res.status(200).send({ log: log });
  } catch (err) {
    next(err);
  }
};

const deleteLog = async (req, res, next) => {
  const { log_id } = req.params;

  try {
    const rowCount = await serviceDeleteLog(log_id);
    if (rowCount === 1) {
      return res.status(204).send();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  patchLog,
  deleteLog,
};
