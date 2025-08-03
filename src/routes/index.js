const { Router } = require("express");

const routes = Router();

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const agenciesRouter = require("./agencies.routes");

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/agencies", agenciesRouter);

module.exports = routes;