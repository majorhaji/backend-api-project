exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: "Cannot find what you wanted" });
};

exports.handle500s = (err, req, res, next) => {
  if (err.status === 500) {
    res.status(500).send({ msg: "Error in code somewhere" });
  } else {
    next(err);
  }
};
