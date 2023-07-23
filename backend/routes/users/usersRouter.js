const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../../controllers/users/usersCtrl");
const isLogin = require("../../middlewares/isLogin");

const usersRouter = express.Router();

//!Register
usersRouter.post("/register", register);
// login
usersRouter.post("/login", login);
// profile
usersRouter.get("/profile", isLogin, getProfile);

module.exports = usersRouter;
