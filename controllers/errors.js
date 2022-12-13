exports.handleCustomErrors = (req, res, next) => {
  res
    .status(404)
    .send({ msg: "You tried to look for something and it wasn't found" });
};

exports.handle400s = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handle500s = (err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "Error in code somewhere" });
  } else {
    next(err);
  }
};

exports.handle404s = (err, req, res, next) => {
  res.status(404).send({ msg: "Cannot find what you wanted" });
};
