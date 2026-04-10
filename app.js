const express = require("express");
const plantsRouter = require("./routers/plants_routers");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/plants", plantsRouter);

module.exports = app;
