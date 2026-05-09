const mongoose = require("mongoose");

const FinalReportSchema = new mongoose.Schema(
  {
    aiReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIReport",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    recommendations: {
      type: String,
    },
    severity: {
      type: String,
      enum: ["None", "Low", "Medium", "High", "Critical"],
      default: "None",
    },
    manualAnnotation: {
      x: { type: Number },
      y: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    confidenceScore: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FinalReport", FinalReportSchema);
