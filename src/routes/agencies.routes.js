const { Router } = require("express");

const agenciesRoutes = Router();

const AgenciesController = require("../controllers/AgenciesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAdminAuthorization = require("../middlewares/verifyUserAdminAuthorization");

const agenciesController = new AgenciesController();

agenciesRoutes.use(ensureAuthenticated);
agenciesRoutes.use(verifyUserAdminAuthorization());

agenciesRoutes.post("/", agenciesController.create);
agenciesRoutes.put("/:agency_id", agenciesController.update);
agenciesRoutes.get("/", agenciesController.index);

module.exports = agenciesRoutes;