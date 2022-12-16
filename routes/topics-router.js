const { getTopics } = require("../controllers/controllers.topics");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
