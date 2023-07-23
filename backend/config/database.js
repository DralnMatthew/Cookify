const mongoose = require("mongoose");
//connect to db

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dralnmatthew:z88uXr6UEfhOa3wR@mern-cook-v1.vfbuybc.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("DB has been connected");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

module.exports = connectDB;
