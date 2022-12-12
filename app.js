const express = require("express");
const app = express();

const { getTopics } = require("./controllers/controllers.topics");
const { handle500s, handle404s } = require("./controllers/errors");

app.get("/api/topics", getTopics);

app.all("*", handle404s);

app.use(handle500s, (err, req, res, next) => {
  console.log(err);
  res.status(500).send(err);
});

module.exports = app;
