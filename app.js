const express = require("express");
const app = express();

const { getTopics } = require("./controllers/controllers.topics");
const { getArticles } = require("./controllers/controllers.articles");
const { handle500s, handle404s } = require("./controllers/errors");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.all("*", handle404s);

app.use(handle500s);

module.exports = app;
