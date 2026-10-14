import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(400).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  res.json(user);
});

export default router;