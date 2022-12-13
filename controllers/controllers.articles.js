const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
} = require("../models/models.articles");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((rows) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((rows) => {
      res.status(200).send({
        comments: rows,
      });
    })
    .catch((err) => {
      next(err);
    });
};
