const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateLogin } = require('../middleware/validate');

// Public route for login
router.post('/login', validateLogin, login);

// Private route to get current authenticated user
router.get('/me', protect, getMe);

module.exports = router;
