const express = require("express");
const {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  getPublicPosts,
} = require("../../controllers/posts/postsCtrl");

const isLogin = require("../../middlewares/isLogin");
const checkAccountVerification = require("../../middlewares/isAccountVerified");

const postsRouter = express.Router();

//create
postsRouter.post("/", isLogin, checkAccountVerification, createPost);
//getting all
postsRouter.get("/", isLogin, getPosts);
//get only 4 posts
postsRouter.get("/public", getPublicPosts);
//single
postsRouter.get("/:id", getPost);
//update
postsRouter.put("/:id", isLogin, updatePost);
//delete
postsRouter.delete("/:id", isLogin, deletePost);

module.exports = postsRouter;
