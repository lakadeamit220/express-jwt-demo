const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { register, login, logout } = require('./controllers/authController');
const authMiddleware = require('./middlewares/authMiddleware');
const validationMiddleware = require('./middlewares/validationMiddleware');
const { registerValidation, loginValidation } = require('./validators/authValidator');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); // Parse JSON request bodies

// Debugging middleware to log request bodies
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  console.log("Request Body:", req.body);
  next();
});

// Routes
app.post('/register', registerValidation, validationMiddleware, register);
app.post('/login', loginValidation, validationMiddleware, login);
app.post('/logout', authMiddleware, logout);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});