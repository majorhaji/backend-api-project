const express = require("express");
const app = express();
const cors = require("cors");

const apiRouter = require("./routes/api-router");
const {
  postCommentByArticleId,
  patchArticleById,
} = require("./controllers/controllers.articles");

const {
  handle500s,
  handle404s,
  handle400s,
  handleBadPaths,
} = require("./controllers/errors");

app.use(cors());

app.use("/api", apiRouter);

app.use(express.json());

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.all("*", handleBadPaths);

app.use(handle404s, (err, req, res, next) => {
  next(err);
});

app.use(handle400s, (err, req, res, next) => {
  next(err);
});

app.use(handle500s);

module.exports = app;
