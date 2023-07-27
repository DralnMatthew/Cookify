const express = require("express");
const {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  getPublicPosts,
  likePost,
  disLikePost,
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
//like post
postsRouter.put("/likes/:id", isLogin, likePost);
//schedule post
postsRouter.put("/schedule/:postId", isLogin, schedule);
//dislike post
postsRouter.put("/dislikes/:id", isLogin, disLikePost);
//clap a post
postsRouter.put("/claps/:id", isLogin, claps);
//update
postsRouter.put("/:id/post-view-count", isLogin, postViewCount);
//single
postsRouter.get("/:id", getPost);
//update
postsRouter.put("/:id", isLogin, updatePost);
//delete
postsRouter.delete("/:id", isLogin, deletePost);

module.exports = postsRouter;
