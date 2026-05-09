const express = require("express");
const router = express.Router();

const imageController = require("../controllers/MedicalImage");
const { authMiddleware, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  imageController.uploadImage,
);

router.get("/my-images", authMiddleware, imageController.getMyImages);

router.get("/all", authMiddleware, isAdmin, imageController.getAllImages);

router.get("/details/:id", authMiddleware, imageController.getCaseDetails);
router.get(
  "/pending-reviews",
  authMiddleware,
  isAdmin,
  imageController.getPendingReviews,
);

router.delete("/:id", authMiddleware, imageController.deleteImage);

module.exports = router;
