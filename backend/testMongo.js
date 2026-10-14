import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1:27017/complaints")
  .then(() => {
    console.log("MongoDB Connected!");
    process.exit();
  })
  .catch((err) => {
    console.log("Connection Error:", err);
    process.exit();
  });