const request = require("supertest");
const path = require("path");
const mongoose = require("mongoose");
const app = require("../../app");
const Comment = require("../../model/Comment/Comment");
const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const Category = require("../../model/Category/Category");
const generateToken = require("../../utils/generateToken");
require("dotenv").config({ path: ".env" });

let userToken;
let postId;
let userId;
let commentId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    await mongoose.connect(process.env.MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Category.deleteMany({});
  await Comment.deleteMany({});

  const user = await User.create({
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
    role: "user",
  });
  userId = user._id;
  userToken = generateToken(user);

  const category = await Category.create({
    name: "Tech",
    author: userId,
  });

  imagePath = path.join(__dirname, "test-file.jpg");

  const post = await Post.create({
    title: "Test Post",
    content: "This is a test post",
    author: userId,
    category: category._id,
    image: imagePath,
  });
  postId = post._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /api/v1/comments/:postId", () => {
  it("should create a new comment", async () => {
    const res = await request(app)
      .post(`/api/v1/comments/${postId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        message: "This is a test comment",
      });

    commentId = res.body.comment._id;

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.comment).toHaveProperty(
      "message",
      "This is a test comment"
    );
    expect(res.body.comment).toHaveProperty("author", userId.toString());
  });
});

describe("PUT /api/v1/comments/:id", () => {
  beforeEach(async () => {
    const comment = await Comment.create({
      message: "Initial message",
      author: userId,
      postId,
    });
    commentId = comment._id;
  });

  it("should update an existing comment", async () => {
    const res = await request(app)
      .put(`/api/v1/comments/${commentId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        message: "Updated message",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.comment).toHaveProperty("message", "Updated message");
  });
});

describe("DELETE /api/v1/comments/:id", () => {
  beforeEach(async () => {
    const comment = await Comment.create({
      message: "Comment to delete",
      author: userId,
      postId,
    });
    commentId = comment._id;
  });

  it("should delete a comment", async () => {
    const res = await request(app)
      .delete(`/api/v1/comments/${commentId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");

    const deletedComment = await Comment.findById(commentId);
    expect(deletedComment).toBeNull();
  });
});
