const { selectArticles } = require("../models/models.articles");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then(({ rows }) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => {
      next(err);
    });
};
