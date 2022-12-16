const { getEndpoints } = require("../controllers/controllers.endpoints");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const userRouter = require("./user-router");
const apiRouter = require("express").Router();

apiRouter.route("/").get(getEndpoints);

apiRouter
  .use("/users", userRouter)
  .use("/topics", topicsRouter)
  .use("/articles", articlesRouter)
  .use("/comments", commentsRouter);
module.exports = apiRouter;
