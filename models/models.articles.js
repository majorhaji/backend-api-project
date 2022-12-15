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
          msg: "Article not found",
        });
      }
      return rows;
    });
};

exports.writeArticleById = (id, body) => {
  const { inc_votes } = body;

  if (inc_votes) {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
        [inc_votes, id]
      )
      .then(({ rows, rowCount }) => {
        if (rowCount === 0) {
          return Promise.reject({ status: 400, msg: "Bad request" });
        }
        return rows;
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: "Request not formatted correctly",
    });
  }
};

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1 ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.writeCommentByArticleId = (id, posted) => {
  const { username, body } = posted;

  if (typeof username === "string" && typeof body === "string") {
    return db
      .query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
        [username, body, id]
      )
      .then(({ rows }) => {
        return rows;
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: "Request isn't formatted correctly",
    });
  }
};
