const express = require("express");
const app = express();

const { getTopics } = require("./controllers/controllers.topics");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
} = require("./controllers/controllers.articles");
const {
  handle500s,
  handle404s,
  handle400s,
  handleBadPaths,
} = require("./controllers/errors");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", handleBadPaths);

app.use(handle404s, (err, req, res, next) => {
  next(err);
});

app.use(handle400s, (err, req, res, next) => {
  next(err);
});

app.use(handle500s);

module.exports = app;
