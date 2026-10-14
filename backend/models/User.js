import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
});

export default mongoose.model("User", userSchema);