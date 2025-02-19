require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Debugging: Log the request body
    console.log("Request Body:", req.body);

    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Trim whitespace and ensure non-empty strings
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return res.status(400).json({ message: "Username and password cannot be empty" });
    }

    if (typeof trimmedPassword !== 'string') {
      return res.status(400).json({ message: "Password must be a string" });
    }

    if (trimmedPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    console.log("UserName:", trimmedUsername);
    console.log("Password:", trimmedPassword, "Type:", typeof trimmedPassword);

    // Debugging: Log the trimmed password before hashing
    console.log("Trimmed Password before hashing:", trimmedPassword);

    // Hash the password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 5);
    console.log("Hashed Password:", hashedPassword);

    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(query, [trimmedUsername, hashedPassword], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database Error", error: err.message });
      }

      res.status(201).json({ message: "User registered successfully!" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Trim whitespace and ensure non-empty strings
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return res.status(400).json({ message: "Username and password cannot be empty" });
    }

    if (typeof trimmedPassword !== 'string') {
      return res.status(400).json({ message: "Password must be a string" });
    }

    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [trimmedUsername], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database Error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = results[0];

      // Compare password with hash
      const isMatch = await bcrypt.compare(trimmedPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token, user, message: "Login successful!" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Logout user (server-side)
exports.logout = (req, res) => {
  // If using cookies for authentication
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Non-secure cookies for development
  });

  res.json({ message: "User logged out successfully" });
};