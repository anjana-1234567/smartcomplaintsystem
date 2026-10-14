import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();


// ADD COMPLAINT
router.post("/", async (req, res) => {
  const complaint = new Complaint(req.body);
  await complaint.save();
  res.json(complaint);
});


// GET ALL
router.get("/", async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
});


// STUDENT COMPLAINTS
router.get("/student/:id", async (req, res) => {
  const complaints = await Complaint.find({
    studentId: req.params.id,
  });

  res.json(complaints);
});


// SAVE RESPONSE
router.put("/response/:id", async (req, res) => {
  await Complaint.findByIdAndUpdate(
    req.params.id,
    {
      response: req.body.response,
    }
  );

  res.json({
    message: "Response Saved",
  });
});


// UPDATE STATUS
router.put("/status/:id", async (req, res) => {
  await Complaint.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    }
  );

  res.json({
    message: "Status Updated",
  });
});


// OLD UPDATE ROUTE
router.put("/:id", async (req, res) => {
  await Complaint.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  res.json({
    message: "Updated",
  });
});

export default router;