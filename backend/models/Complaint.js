import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    studentName: String,

    complaint: String,

    status: {
      type: String,
      default: "Pending",
    },

    response: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);