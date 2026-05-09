const express = require("express");
const router = express.Router();
const aiController = require("../controllers/AIReport");
const { authMiddleware } = require("../middleware/auth");

router.post("/analyze/:imageId", authMiddleware, aiController.analyzeImage);

router.get("/:imageId", authMiddleware, aiController.getReportByImage);

module.exports = router;
