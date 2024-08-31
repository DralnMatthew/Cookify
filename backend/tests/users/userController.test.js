const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
require("dotenv").config({ path: ".env.test" });

beforeAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    await mongoose.connect(process.env.MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("User Registration", () => {
  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/v1/users/register").send({
      username: "testuser",
      password: "Test123!",
      email: "testuser@example.com",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("message", "User Registered Successfully");
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });

  it("should fail if user already exists", async () => {
    await User.create({
      username: "testuser",
      password: "hashedpassword",
      email: "testuser@example.com",
    });

    const res = await request(app).post("/api/v1/users/register").send({
      username: "testuser",
      password: "Test123!",
      email: "testuser@example.com",
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual("User Already Exists");
  });
});

describe("User Login", () => {
  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Test123!", salt);
    await User.create({
      username: "testuser",
      password: hashedPassword,
      email: "testuser@example.com",
    });
  });

  it("should log in an existing user successfully", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      username: "testuser",
      password: "Test123!",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("token");
  });

  it("should fail for invalid credentials", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      username: "testuser",
      password: "WrongPassword",
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual("Invalid login credentials");
  });
});

describe("Get Profile", () => {
  let token;

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Test123!", salt);
    const user = await User.create({
      username: "testuser",
      password: hashedPassword,
      email: "testuser@example.com",
    });

    token = generateToken(user);
  });

  it("should get user profile successfully", async () => {
    const res = await request(app)
      .get("/api/v1/users/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username", "testuser");
  });
});

describe("Password Reset", () => {
  let resetToken;

  beforeEach(async () => {
    const user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "hashedpassword",
    });

    resetToken = await user.generatePasswordResetToken();
    await user.save();
  });

  it("should send a password reset email", async () => {
    const res = await request(app)
      .post("/api/v1/users/forgot-password")
      .send({ email: "testuser@example.com" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Password reset email sent");
  });

  it("should reset the password successfully", async () => {
    const res = await request(app)
      .post(`/api/v1/users/reset-password/${resetToken}`)
      .send({ password: "NewPassword123!" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Password reset successfully");
  });
});
