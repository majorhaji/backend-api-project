const express = require("express");
const app = express();

const { getTopics } = require("./controllers/controllers.topics");
const { handle500s, handle404s } = require("./controllers/errors");

app.get("/api/topics", getTopics);

app.all("*", handle404s);

app.use(handle500s, (req, res, next) => {
  next();
});

module.exports = app;
