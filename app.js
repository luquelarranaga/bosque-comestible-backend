const express = require("express");
const plantsRouter = require("./routers/plants_routers");
const imagesRouter = require("./routers/images_routers");
const logsRouter = require("./routers/logs_routers");
const cors = require("cors");
const InvalidInputError = require("./errors/InvalidInputError");
const NotFoundError = require("./errors/NotFoundError");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/plants", plantsRouter);

app.use("/api/images", imagesRouter);

app.use("/api/logs", logsRouter);

app.all("/*path", (req, res, next) => {
  res.status(400).send({ msg: "Bad request" });
});

app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(404).send({ msg: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err instanceof InvalidInputError) {
    res.status(400).send({ msg: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
