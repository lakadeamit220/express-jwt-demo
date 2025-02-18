const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: "No token provided or invalid format" });
  }

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Unauthorized';
      return res.status(401).json({ message });
    }

    req.user = decoded; // Attach user info to the request
    next();
  });
};
