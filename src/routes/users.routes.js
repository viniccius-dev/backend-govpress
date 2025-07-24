const { Router } = require("express");

const usersRoutes = Router();

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserManagerAuthorization = require("../middlewares/verifyUserManagerAuthorization");

const usersController = new UsersController();

usersRoutes.use(ensureAuthenticated);

usersRoutes.post("/", verifyUserManagerAuthorization() , usersController.create);
usersRoutes.put("/", usersController.update);

module.exports = usersRoutes;