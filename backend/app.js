const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const path = require("path");
const express = require("express");
const usersRouter = require("./routes/users/usersRouter");
const connectDB = require("./config/database");
const {
  notFound,
  globalErrHandler,
} = require("./middlewares/globalErrorHandler");
const categoriesRouter = require("./routes/categories/categoriesRouter");
const postsRouter = require("./routes/posts/postsRouter");
const commentsRouter = require("./routes/comments/commentsRouter");

//!Server
const app = express();

//middlewares
app.use(express.json()); //Pass incoming data

// db connection
connectDB();

// cors middleware
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);

//? Not Found middleware
app.use(notFound);
//! Error middleware
app.use(globalErrHandler);

module.exports = app;
