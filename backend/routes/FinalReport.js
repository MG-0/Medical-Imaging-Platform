const express = require("express");
const router = express.Router();
const finalController = require("../controllers/FinalReport");
const { authMiddleware, isAdmin } = require("../middleware/auth");

router.post(
  "/submit",
  authMiddleware,
  isAdmin,
  finalController.submitFinalReport,
);

router.get(
  "/my-final-reports",
  authMiddleware,
  finalController.getPatientReports,
);

router.get(
  "/download/:reportId",
  authMiddleware,
  finalController.downloadPDFReport,
);

router.put(
  "/edit/:id",
  authMiddleware,
  isAdmin,
  finalController.editFinalReport,
);

module.exports = router;
