import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

// ================= DEBUG MIDDLEWARE =================
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ================= DATABASE CONNECTION =================
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/complaints";

let cachedDb = null;
async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  cachedDb = await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log(`MongoDB connected successfully to ${MONGODB_URI.startsWith("mongodb+srv") ? "MongoDB Atlas" : MONGODB_URI}`);
  return cachedDb;
}

// Ensure DB is connected for every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    return res.status(500).json({
      message: "Database connection failed. Please ensure 0.0.0.0/0 is added to Network Access in MongoDB Atlas.",
      error: err.message,
    });
  }
});

// ================= USER SCHEMA & MODEL =================
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    userId: {
      type: String,
      trim: true,
      default: "", // Roll Number for student, Teacher ID for teacher
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
      default: "student",
    },
    department: {
      type: String,
      default: "Computer Science & Engineering",
    },
    college: {
      type: String,
      default: "ANURAG UNIVERSITY",
    },
    section: {
      type: String,
      default: "CSE-T",
    },
    phone: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Reuse or create model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// ================= COMPLAINT SCHEMA & MODEL =================
const complaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    complaint: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    response: {
      type: String,
      default: "",
    },
    respondedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);

// ================= REGISTER =================
app.post("/api/register", async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const userId = req.body.userId?.trim();
    const password = req.body.password;
    const role = (req.body.role || "student").toLowerCase();
    const department = req.body.department?.trim() || "Computer Science & Engineering";
    const college = req.body.college?.trim() || "ANURAG UNIVERSITY";
    const section = req.body.section?.trim() || "CSE-T";
    const phone = req.body.phone?.trim() || "";

    // Validation
    if (!username || !email || !userId || !password) {
      return res.status(400).json({
        message: "All fields (Username, Email, ID/Roll Number, Password) are required",
      });
    }

    // Check if username or email already registered (case-insensitive)
    const existingUser = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        { email: email },
      ],
    });

    if (existingUser) {
      if (existingUser.email?.toLowerCase() === email) {
        return res.status(400).json({
          message: "Email is already registered. Please login.",
        });
      }
      return res.status(400).json({
        message: "Username is already taken. Please choose another username.",
      });
    }

    // Save permanently in MongoDB
    const newUser = new User({
      username,
      email,
      userId,
      password,
      role,
      department,
      college,
      section,
      phone,
      status: "Active",
    });

    await newUser.save();
    console.log(`[REGISTER SUCCESS] Role: ${role}, User: ${username}, ID: ${userId}, Email: ${email}`);

    res.status(201).json({
      message: "Registered Successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        userId: newUser.userId,
        role: newUser.role,
        department: newUser.department,
        college: newUser.college,
        section: newUser.section,
        phone: newUser.phone,
        status: newUser.status,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Username or Email already registered",
      });
    }

    res.status(500).json({
      message: "Registration Failed: " + (err.message || "Unknown error"),
    });
  }
});

// ================= LOGIN =================
app.post("/api/login", async (req, res) => {
  try {
    const identifier = (req.body.username || req.body.email || req.body.identifier)?.trim();
    const password = req.body.password;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Username/Email and Password are required",
      });
    }

    // Find user by either username OR email (case-insensitive for username, exact lower for email)
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        { email: identifier.toLowerCase() },
      ],
      password: password,
    });

    if (!user) {
      console.log(`[LOGIN FAILED] Identifier: ${identifier}`);
      return res.status(400).json({
        message: "Invalid Username/Email or Password",
      });
    }

    console.log(`[LOGIN SUCCESS] User: ${user.username} (${user.role})`);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email || "",
      userId: user.userId || "",
      role: user.role || "student",
      department: user.department || "Computer Science & Engineering",
      college: user.college || "ANURAG UNIVERSITY",
      section: user.section || "CSE-T",
      phone: user.phone || "",
      status: user.status || "Active",
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Server Error during login",
    });
  }
});

// ================= GET USER PROFILE BY ID =================
app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
});

// ================= UPDATE USER PROFILE PERMANENTLY =================
app.put("/api/user/:id", async (req, res) => {
  try {
    const updateData = {};
    if (req.body.email !== undefined) updateData.email = req.body.email.trim().toLowerCase();
    if (req.body.userId !== undefined) updateData.userId = req.body.userId.trim();
    if (req.body.department !== undefined) updateData.department = req.body.department.trim();
    if (req.body.college !== undefined) updateData.college = req.body.college.trim();
    if (req.body.section !== undefined) updateData.section = req.body.section.trim();
    if (req.body.phone !== undefined) updateData.phone = req.body.phone.trim();
    if (req.body.password) updateData.password = req.body.password;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`[PROFILE UPDATED] User ID: ${req.params.id}, Username: ${updatedUser.username}`);
    res.json(updatedUser);
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

// ================= GET ALL REGISTERED USERS =================
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ================= ADD COMPLAINT =================
app.post("/api/add", async (req, res) => {
  try {
    const complaint = new Complaint({
      name: req.body.name,
      studentId: req.body.studentId || req.body.userId || "",
      userId: req.body.userId || "",
      email: req.body.email || "",
      complaint: req.body.complaint,
      status: "Pending",
      response: "",
    });

    await complaint.save();
    console.log(`[NEW COMPLAINT] from: ${req.body.name}`);
    res.json(complaint);
  } catch (err) {
    console.error("ADD COMPLAINT ERROR:", err);
    res.status(500).json({
      message: "Failed to Add Complaint",
    });
  }
});

// ================= GET ALL COMPLAINTS =================
app.get("/api", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error("GET COMPLAINTS ERROR:", err);
    res.status(500).json({
      message: "Failed to Fetch Complaints",
    });
  }
});

// ================= GET STUDENT COMPLAINTS =================
app.get("/api/student/:identifier", async (req, res) => {
  try {
    const id = req.params.identifier;
    const complaints = await Complaint.find({
      $or: [{ name: id }, { studentId: id }, { userId: id }],
    }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch student complaints" });
  }
});

// ================= SAVE RESPONSE =================
app.put("/api/response/:id", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        response: req.body.response,
        respondedBy: req.body.respondedBy || "Teacher",
      },
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }

    res.json(updated);
  } catch (err) {
    console.error("RESPONSE UPDATE ERROR:", err);
    res.status(500).json({
      message: "Response Update Failed",
    });
  }
});

// ================= UPDATE STATUS =================
app.put("/api/status/:id", async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }

    res.json(updated);
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    res.status(500).json({
      message: "Status Update Failed",
    });
  }
});

// ================= DELETE COMPLAINT =================
app.delete("/api/complaint/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Complaint Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete complaint" });
  }
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;