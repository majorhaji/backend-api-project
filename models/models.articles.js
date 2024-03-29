const db = require("../db/connection.js");

exports.selectArticles = (query) => {
  const validQueries = ["topic"];

  let sort_by = query.sort_by;
  let order = "desc";
  if (query.hasOwnProperty("order")) {
    order = query.order;
  }
  const queryKey = Object.keys(query)[0];

  // queryKey === "sort_by"
  //   ? (sort_by = query[queryKey])
  //   : (sort_by = "created_at");

  if (query[queryKey] === "asc") order = "asc";

  let SQL = `SELECT articles.article_id, articles.author, articles.created_at, title, topic, articles.votes, COUNT(comments.article_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id =articles.article_id`;

  let groupBy = ` GROUP BY articles.article_id`;
  let orderBy = ``;

  sort_by === "comment_count"
    ? (orderBy += ` ORDER BY ${sort_by} ${order};`)
    : (orderBy += ` ORDER BY articles.${sort_by} ${order};`);

  if (validQueries.includes(queryKey) && query[queryKey]) {
    let queryString = "";
    queryString += ` WHERE ${queryKey}='${query[queryKey]}'`;
    SQL += queryString;
  }

  SQL += groupBy;
  if (query.sort_by) {
    SQL += orderBy;
  } else {
    SQL += ` ORDER BY articles.created_at ${order}`;
  }

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
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.body, COUNT(comments.article_id)::int AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id=comments.article_id
      WHERE articles.article_id=$1
      GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
};

exports.writeArticleById = (id, body) => {
  const { inc_votes } = body;

  if (typeof inc_votes === "number") {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
        [inc_votes, id]
      )
      .then(({ rows }) => {
        return rows[0];
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
      .query(`SELECT * FROM users WHERE username =$1;`, [username])
      .then(({ rowCount }) => {
        if (rowCount === 0) {
          return Promise.reject({
            status: 400,
            msg: "Username does not exist",
          });
        }
      })
      .then(() => {
        return db.query(
          `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
          [username, body, id]
        );
      })
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
