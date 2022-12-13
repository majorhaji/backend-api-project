const db = require("../db/connection.js");

exports.selectTopics = () => {
  const SQL = `SELECT * FROM topics;`;

  return db.query(SQL).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "You tried to look for something and it wasn't found",
      });
    }
    return rows;
  });
};
