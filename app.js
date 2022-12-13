const express = require("express");
const app = express();

app.use(express.json());

const { getTopics } = require("./controllers/controllers.topics");
const {
  getArticles,
  getArticleById,
} = require("./controllers/controllers.articles");
const {
  handle500s,
  handle404s,
  handle400s,
  handleCustomErrors,
} = require("./controllers/errors");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", handleCustomErrors);

app.use(handle500s, (err, req, res, next) => {
  console.log(err);
  next(err);
});

app.use(handle404s, (err, req, res, next) => {
  console.log(err);
});

module.exports = app;
