const express = require("express");
const routes = require("./routes/index");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(express.json());
app.use(logger);

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(errorHandler);

module.exports = app;
