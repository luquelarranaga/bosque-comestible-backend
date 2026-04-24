const express = require("express");
const router = express.Router();
const { patchLog, deleteLog } = require("../controllers/logs_controllers");
const handleInvalidMethods = require("../utils/handleInvalidMethods");

router
  .route("/:log_id")
  .patch(patchLog)
  .delete(deleteLog)
  .all(handleInvalidMethods);

module.exports = router;
