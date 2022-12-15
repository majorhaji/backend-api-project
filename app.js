const express = require("express");
const app = express();

const { getTopics } = require("./controllers/controllers.topics");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("./controllers/controllers.articles");

const { getUsers } = require("./controllers/controllers.users");
const {
  handle500s,
  handle404s,
  handle400s,
  handleBadPaths,
} = require("./controllers/errors");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.post("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.get("/api/users", getUsers);

app.all("*", handleBadPaths);

app.use(handle404s, (err, req, res, next) => {
  next(err);
});

app.use(handle400s, (err, req, res, next) => {
  next(err);
});

app.use(handle500s);

module.exports = app;
