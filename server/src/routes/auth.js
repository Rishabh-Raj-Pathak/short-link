import express from "express";
import { User } from "../models/index.js";
import { validateEmail, validatePassword } from "../utils/validations.js";
import { generateToken } from "../utils/jwt.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /auth/signup - Create new user account
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.message });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists. Try logging in.",
        code: "EMAIL_EXISTS",
      });
    }

    // Hash password and create user
    const passwordHash = await User.hashPassword(password);
    const user = new User({
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Set HTTP-only cookie
    setAuthCookie(res, token);

    // Return user profile (password excluded by toJSON method)
    res.status(201).json({
      message: "Account created. You can log in now.",
      user: user.toJSON(),
      token, // Also return token for API clients
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(409).json({
        error: "An account with this email already exists. Try logging in.",
        code: "EMAIL_EXISTS",
      });
    }

    res.status(500).json({
      error: "Failed to create account. Please try again.",
      code: "SIGNUP_FAILED",
    });
  }
});

// POST /auth/login - User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.message });
    }

    // Find user first to provide specific error messages
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        error: "Account doesn't exist. Please sign up.",
        code: "USER_NOT_FOUND",
      });
    }

    // Check password after confirming user exists
    if (!password || password.trim() === "") {
      return res.status(400).json({ error: "Please enter your password." });
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Incorrect password.",
        code: "INVALID_PASSWORD",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set HTTP-only cookie
    setAuthCookie(res, token);

    res.json({
      message: "Login successful",
      user: user.toJSON(),
      token, // Also return token for API clients
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed. Please try again.",
      code: "LOGIN_FAILED",
    });
  }
});

// POST /auth/logout - User logout
router.post("/logout", (req, res) => {
  try {
    clearAuthCookie(res);

    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
      code: "LOGOUT_FAILED",
    });
  }
});

// GET /auth/me - Get current user profile
router.get("/me", requireAuth, (req, res) => {
  try {
    res.json({
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Failed to get user profile",
      code: "PROFILE_FAILED",
    });
  }
});

export default router;
