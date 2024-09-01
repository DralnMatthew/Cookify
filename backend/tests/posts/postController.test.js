const request = require("supertest");
const bcrypt = require("bcryptjs");
const path = require("path");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("../../model/User/User");
const Post = require("../../model/Post/Post");
const Category = require("../../model/Category/Category");
const generateToken = require("../../utils/generateToken");
require("dotenv").config({ path: ".env" });

let userToken;
let postId;
let userId;
let categoryId;

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
  categoryId = category._id;
  imagePath = path.join(__dirname, "test-file.jpg");

  const post = await Post.create({
    title: "Sample Post",
    content: "This is a sample post.",
    category: categoryId,
    author: userId,
    image: imagePath,
  });
  postId = post._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/v1/posts", () => {
  it("should get all posts", async () => {
    const res = await request(app)
      .get("/api/v1/posts")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.posts).toBeInstanceOf(Array);
    expect(res.body.posts[0]).toHaveProperty("title", "Sample Post");
  });

  it("should filter posts by category and searchTerm", async () => {
    const res = await request(app)
      .get("/api/v1/posts")
      .query({ category: categoryId, searchTerm: "Sample" })
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(201);
    expect(res.body.posts).toHaveLength(1);
    expect(res.body.posts[0]).toHaveProperty("title", "Sample Post");
  });
});

describe("GET /api/v1/posts/public", () => {
  it("should get only 4 public posts", async () => {
    const res = await request(app).get("/api/v1/posts/public");

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.posts).toBeInstanceOf(Array);
    expect(res.body.posts.length).toBeLessThanOrEqual(4);
  });
});

describe("GET /api/v1/posts/:id", () => {
  it("should get a single post by id", async () => {
    const res = await request(app).get(`/api/v1/posts/${postId}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.post).toHaveProperty("title", "Sample Post");
  });
});

describe("DELETE /api/v1/posts/:id", () => {
  it("should delete a post", async () => {
    const res = await request(app)
      .delete(`/api/v1/posts/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Post successfully deleted");
  });

  it("should fail if user is not the author", async () => {
    const otherUser = await User.create({
      username: "otheruser",
      email: "otheruser@example.com",
      password: "password123",
      role: "user",
    });
    const otherToken = generateToken(otherUser);

    await request(app)
      .delete(`/api/v1/posts/${postId}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(500);
  });
});

describe("PUT /api/v1/posts/:id", () => {
  it("should update a post", async () => {
    const res = await request(app)
      .put(`/api/v1/posts/${postId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Updated Post Title",
        content: "Updated post content.",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.post).toHaveProperty("title", "Updated Post Title");
  });

  it("should fail if post not found", async () => {
    await request(app)
      .put("/api/v1/posts/invalidId")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Non-existent post",
      })
      .expect(500);
  });
});

describe("PUT /api/v1/posts/likes/:id", () => {
  it("should like a post", async () => {
    const res = await request(app)
      .put(`/api/v1/posts/likes/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post liked successfully.");
  });
});

describe("PUT /api/v1/posts/dislikes/:id", () => {
  it("should dislike a post", async () => {
    const res = await request(app)
      .put(`/api/v1/posts/dislikes/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post disliked successfully.");
  });
});

describe("PUT /api/v1/posts/claps/:id", () => {
  it("should clap a post", async () => {
    const res = await request(app)
      .put(`/api/v1/posts/claps/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post clapped successfully.");
  });
});

describe("PUT /api/v1/posts/schedule/:postId", () => {
  it("should schedule a post", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const res = await request(app)
      .put(`/api/v1/posts/schedule/${postId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ scheduledPublish: futureDate.toISOString() });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.post.schedulePost).toBe(futureDate.toISOString());
  });

  it("should fail if the scheduled date is in the past", async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    await request(app)
      .put(`/api/v1/posts/schedule/${postId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ scheduledPublish: pastDate.toISOString() })
      .expect(500);
  });
});
