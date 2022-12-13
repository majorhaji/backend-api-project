const db = require("../db/connection.js");

exports.selectArticles = () => {
  const SQL = `SELECT articles.article_id, articles.author, articles.created_at, title, topic, articles.votes, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id =articles.article_id 
  GROUP BY articles.article_id 
  ORDER BY articles.created_at desc;`;

  return db
    .query(SQL)
    .then((articles) => {
      return articles;
    })
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Path not found",
        });
      }
      return rows;
    });
};

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [id])
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Path not found",
        });
      }
      return rows;
    });
};
