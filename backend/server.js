require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/User");
const imageRoutes = require("./routes/MedicalImage");
const aiRoutes = require("./routes/AIReport");
const finalReportRoutes = require("./routes/FinalReport");

const app = express();

connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.use("/users", userRoutes);
app.use("/images", imageRoutes);
app.use("/ai-reports", aiRoutes);
app.use("/final-reports", finalReportRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Medical Analysis API is Running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
