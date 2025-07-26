const { Router } = require("express");

const usersRoutes = Router();

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserManagerAuthorization = require("../middlewares/verifyUserManagerAuthorization");

const usersController = new UsersController();

usersRoutes.use(ensureAuthenticated);

usersRoutes.post("/", verifyUserManagerAuthorization() , usersController.create);
usersRoutes.put("/", usersController.update);
usersRoutes.get("/", verifyUserManagerAuthorization(), usersController.index);
usersRoutes.get("/:id", verifyUserManagerAuthorization(), usersController.show);
usersRoutes.delete("/:id", verifyUserManagerAuthorization(), usersController.delete);

module.exports = usersRoutes;