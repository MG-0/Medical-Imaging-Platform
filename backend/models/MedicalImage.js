const mongoose = require("mongoose");

const medicalImageSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    imageType: {
      type: String,
      enum: ["MRI", "CT", "X-Ray"],
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Analyzed", "Reviewed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MedicalImage", medicalImageSchema);
