exports.handleBadPaths = (req, res, next) => {
  res
    .status(404)
    .send({ msg: "You tried to look for something and it wasn't found" });
};

exports.handle400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    console.log(err);
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handle404s = (err, req, res, next) => {
  if (err.status === 404) {
    console.log(err);
    res.status(404).send(err);
  } else {
    next(err);
  }
};

exports.handle500s = (req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
