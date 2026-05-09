const mongoose = require("mongoose");

const AIReportSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalImage",
      required: true,
      unique: true,
    },
    tumorDetected: {
      type: Boolean,
      required: true,
    },
    confidenceScore: {
      type: Number,
      required: true,
    },
    heatmapPath: {
      type: String,
    },
    analysisDate: {
      type: Date,
      default: Date.now,
    },
    initialDiagnosis: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AIReport", AIReportSchema);
