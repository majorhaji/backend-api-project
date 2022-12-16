const { readEndpoints } = require("../models/models.endpoints");

exports.getEndpoints = (req, res, next) => {
  readEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      err;
    });
};
