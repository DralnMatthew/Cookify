const http = require("http");
const express = require("express");
const usersRouter = require("./routes/users/usersRouter");
const connectDB = require("./config/database");
const {
  notFound,
  globalErrHandler,
} = require("./middlewares/globalErrorHandler");

//!Server
const app = express();

//middlewares
app.use(express.json()); //Pass incoming data

// db connection
connectDB();

// Routes
app.use("/api/v1/users", usersRouter);

//? Not Found middleware
app.use(notFound);
//! Error middleware
app.use(globalErrHandler);

const server = http.createServer(app);
//? Start the server
const PORT = process.env.PORT || 9080;
server.listen(PORT, console.log(`Server is running on port ${PORT}`));
