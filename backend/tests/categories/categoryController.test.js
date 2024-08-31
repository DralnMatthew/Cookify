const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const Category = require("../../model/Category/Category");
const User = require("../../model/User/User");
const Post = require("../../model/Post/Post");
const generateToken = require("../../utils/generateToken");
require("dotenv").config({ path: ".env" });

let userToken;
let categoryId;
let user;
let category;

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
  await Category.deleteMany({});
  await Post.deleteMany({});

  const user_ = await User.create({
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
    role: "user",
  });

  userToken = generateToken(user_);

  const category_ = await Category.create({
    name: "Tech",
    author: user_._id,
  });

  user = user_;
  category = category_;
  categoryId = category._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany();
  await Category.deleteMany();
});

describe("POST /api/v1/categories", () => {
  it("should create a new category", async () => {
    const res = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "New Category",
        author: user._id,
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.category).toHaveProperty("name", "New Category");
    expect(res.body.category).toHaveProperty("shares", 0);
  });

  it("should fail if category already exists", async () => {
    const res = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Tech",
        author: user._id,
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Category already exists");
  });
});

describe("GET /api/v1/categories", () => {
  it("should get all categories", async () => {
    const res = await request(app).get("/api/v1/categories");

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.categories).toBeInstanceOf(Array);
    expect(res.body.categories[0]).toHaveProperty("name", "Tech");
    expect(res.body.categories[0]).toHaveProperty("shares", 0);
  });
});

describe("DELETE /api/v1/categories/:id", () => {
  it("should delete a category", async () => {
    const res = await request(app)
      .delete(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Categoryies successfully deleted");
  });
});

describe("PUT /api/v1/categories/:id", () => {
  it("should update a category", async () => {
    const res = await request(app)
      .put(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Updated Category",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.category).toHaveProperty("name", "Updated Category");
  });
});
