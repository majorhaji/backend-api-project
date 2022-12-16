const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/controllers.articles");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticleById);

articlesRouter.route("/:article_id/comments").get(getCommentsByArticleId);

module.exports = articlesRouter;
