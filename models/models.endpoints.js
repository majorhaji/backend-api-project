const fs = require("fs/promises");
const db = require("../db/connection");
exports.readEndpoints = () => {
  return fs.readFile("endpoints.json").then((endpoints) => {
    const parsed = JSON.parse(endpoints);
    return parsed;
  });
};
