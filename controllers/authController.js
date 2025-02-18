const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register new user
exports.register = (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: "Server Error" });

    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: "Database Error" });

      res.status(201).json({ message: "User registered successfully!" });
    });
  });
};

// Login user
exports.login = (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const user = results[0];

    // Compare password with hash
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Server Error" });
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    });
  });
};

// Logout user (server-side)
exports.logout = (req, res) => {
  // You can invalidate the token here if using a session store or token blacklist
  // If you're using cookies (httpOnly cookies), you can clear the cookie like this:
  res.clearCookie("token", { httpOnly: true, secure: true }); // Ensure `secure: true` for HTTPS

  res.json({ message: "User logged out successfully" });
};

