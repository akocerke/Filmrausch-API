const { Router } = require("express");
const { AuthRouter } = require("./auth");
const { UsersRouter } = require("./users/users");
// const {FavoritesRouter} = require("./favorites/favorites");
const { StatusCodes } = require("http-status-codes");
const bodyParser = require("body-parser");

const AppRouter = Router();

AppRouter.use("/auth", AuthRouter);
AppRouter.use("/users", UsersRouter);
AppRouter.use(bodyParser.json());
// AppRouter.use("/favorites", FavoritesRouter);

module.exports = { AppRouter };
