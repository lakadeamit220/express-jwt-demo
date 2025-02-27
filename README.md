# Express JWT Demo

This is a demo project for implementing authentication using **Express.js**, **JWT (JSON Web Tokens)**, and **MySQL**. It includes user registration, login, and logout functionality with secure password hashing, validation, and middleware support.

## Features

- **User Registration**: Create a new user with hashed passwords stored in the database.
- **User Login**: Authenticate users and issue a JSON Web Token (JWT) for session management.
- **User Logout**: Invalidate the user session (designed for cookie-based authentication).
- **Middleware Support**:
  - Request validation using `express-validator`.
  - Authentication middleware to protect routes.
  - Error-handling middleware for improved debugging and response consistency.
- **Environment Variable Support**: Configuration using `dotenv`.
- **Database Integration**: Uses MySQL for user storage with parameterized queries to prevent SQL injection.

## Tech Stack

- **Backend**: [Express.js](https://expressjs.com/)
- **Database**: MySQL
- **Authentication**: JWT, bcrypt.js
- **Validation**: express-validator
- **Environment Management**: dotenv
- **Security**: cors, bcrypt.js

## File Structure

```plaintext
.
├── controllers/
│   ├── authController.js  # Handles authentication logic
├── middlewares/
│   ├── authMiddleware.js  # Middleware for verifying JWT tokens
│   ├── validationMiddleware.js  # Middleware for handling validation errors
├── validators/
│   ├── authValidator.js   # Validation rules for authentication routes
├── config/
│   ├── db.js              # Database configuration and connection
├── .env                   # Environment variables (not included in repo)
├── server.js              # Main entry point of the application
└── README.md              # Project documentation
