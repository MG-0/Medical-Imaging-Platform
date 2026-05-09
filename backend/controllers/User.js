const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// SignUP controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user with the hashed password
    const newUser = new User({ name, email: normalizedEmail, password: hashedPassword });
    await newUser.save();
    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "User registration failed!" });
  }
};

// SignIN controller
exports.signin = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    // Find the user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );
    // Send the token and user information in the response
    res.status(200).json({
      message: "User signed in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Sign in failed!" });
  }
};

// Get User Profile controller
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("GetProfile Error:", error);
    res.status(500).json({ message: "Failed to get user profile!" });
  }
};

// Get All Users controller
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error("GetAllUsers Error:", error);
    res.status(500).json({ message: "Failed to get all users!" });
  }
};

//  Update User Controller
exports.updateUser = async (req, res) => {
  try {
    const users = req.body;
    const userIdFromParams = req.params.id;
    const userIdFromToken = req.user.id;
    // الـ Ownership Check
    if (userIdFromParams !== userIdFromToken && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only update your own profile!" });
    }
    if (users.password) {
      users.password = await bcrypt.hash(users.password, 10);
    }
    if (users.email) {
      users.email = users.email.toLowerCase().trim();
    }

    const user = await User.findByIdAndUpdate(userIdFromParams, users, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Updating User Profile Failed!" });
  }
};

//  Delete User Controller
exports.deleteUser = async (req, res) => {
  try {
    const userIdFromParams = req.params.id;
    const userIdFromToken = req.user.id;
    // الـ Ownership Check
    if (userIdFromParams !== userIdFromToken && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only delete your own profile!" });
    }
    const user = await User.findByIdAndDelete(userIdFromParams);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deleting User Failed!" });
  }
};

// Get All Doctors
exports.getDoctors = async (req, res) => {
  try {
    // جلب المستخدمين الذين لديهم صلاحية طبيب أو أدمن
    const doctors = await User.find({
      role: { $in: ["doctor", "admin"] },
    }).select("name email _id");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};
