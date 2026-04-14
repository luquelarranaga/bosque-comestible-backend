const express = require("express");
const plantsRouter = require("./routers/plants_routers");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/plants", plantsRouter);

module.exports = app;

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
