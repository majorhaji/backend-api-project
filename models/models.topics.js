const db = require("../db/connection.js");

exports.selectTopics = () => {
  const SQL = `SELECT * FROM topics;`;

  return db.query(SQL).then(({ rows }) => {
    return rows;
  });
};
