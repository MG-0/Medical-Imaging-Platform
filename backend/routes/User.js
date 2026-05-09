const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");
const { authMiddleware, isAdmin } = require("../middleware/auth");

// Signup
router.post("/signup", userController.signup);

// Signin
router.post("/signin", userController.signin);

// Update User
router.put("/:id", authMiddleware, userController.updateUser);

// Delete User
router.delete("/:id", authMiddleware, userController.deleteUser);

// Get All Users
router.get("/all", authMiddleware, isAdmin, userController.getAllUsers);

// Get Doctors for Patient Dashboard
router.get("/doctors/list", authMiddleware, userController.getDoctors);

// Get User Profile
router.get("/:id", authMiddleware, userController.getUserProfile);

module.exports = router;
