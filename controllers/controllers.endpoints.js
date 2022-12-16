const fs = require("fs/promises");
exports.getEndpoints = (req, res, next) => {
  fs.readFile("endpoints.json")
    .then((data) => {
      const endpoints = JSON.parse(data);
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
