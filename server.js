const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { register, login, logout } = require('./controllers/authController');
const authMiddleware = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/register', register);
app.post('/login', login);
app.post('/logout', authMiddleware, logout); // Protected route

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
