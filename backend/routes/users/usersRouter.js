const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  profileViewers,
  followingUser,
  unFollowingUser,
  resetPassword,
  forgotpassword,
  accountVerificationEmail,
  verifyAccount,
  getPublicProfile,
  uploadeProfilePicture,
  uploadeCoverImage,
  updateUserProfile,
} = require("../../controllers/users/usersCtrl");
const isLogin = require("../../middlewares/isLogin");
const storage = require("../../utils/fileUpload");

const usersRouter = express.Router();

//! file upload middleware
const upload = multer({ storage });

//!Register
usersRouter.post("/register", register);
// login
usersRouter.post("/login", login);
// upload profile image
usersRouter.put(
  "/upload-profile-image",
  isLogin,
  upload.single("file"),
  uploadeProfilePicture
);
// upload profile image
usersRouter.put(
  "/upload-cover-image",
  isLogin,
  upload.single("file"),
  uploadeCoverImage
);
// public profile
usersRouter.get("/public-profile/:userId", getPublicProfile);
// profile
usersRouter.get("/profile", isLogin, getProfile);
//!  update profile
usersRouter.put("/update-profile", isLogin, updateUserProfile);
// block user
usersRouter.put("/block/:userIdToBlock", isLogin, blockUser);
// unblock user
usersRouter.put("/unblock/:userIdToUnBlock", isLogin, unblockUser);
// profile viewer
usersRouter.get("/profile-viewer/:userProfileId", isLogin, profileViewers);

// send account verification email
usersRouter.get(
  "/account-verification-email",
  isLogin,
  accountVerificationEmail
);

// send account verification email
usersRouter.put("/account-verification/:verifyToken", isLogin, verifyAccount);

// forgot password user
usersRouter.post("/forgot-password", forgotpassword);

// following user
usersRouter.put("/following/:userToFollowId", isLogin, followingUser);
// unfollowing user
usersRouter.put("/unfollowing/:userToUnFollowId", isLogin, unFollowingUser);

// reset password user
usersRouter.post("/reset-password/:resetToken", resetPassword);

module.exports = usersRouter;
