const express = require("express");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  profileViewers,
  followingUser,
  unFollowingUser,
} = require("../../controllers/users/usersCtrl");
const isLogin = require("../../middlewares/isLogin");

const usersRouter = express.Router();

//!Register
usersRouter.post("/register", register);
// login
usersRouter.post("/login", login);
// profile
usersRouter.get("/profile", isLogin, getProfile);
// block user
usersRouter.put("/block/:userIdToBlock", isLogin, blockUser);
// ublock user
usersRouter.put("/unblock/:userIdToUnBlock", isLogin, unblockUser);
// profile viewer
usersRouter.get("/profile-viewer/:userProfileId", isLogin, profileViewers);
// following user
usersRouter.put("/following/:userToFollowId", isLogin, followingUser);
// unfollowing user
usersRouter.put("/unfollowing/:userToUnFollowId", isLogin, unFollowingUser);

module.exports = usersRouter;
