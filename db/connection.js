const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});
const config =
  ENV === "production"
    ? { connectionString: process.env.DATABASE_URL, max: 2 }
    : {};

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

module.exports = new Pool(config);
