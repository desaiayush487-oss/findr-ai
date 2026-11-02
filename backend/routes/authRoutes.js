const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Because server.js has app.use('/api/auth', authRoutes),
// this route becomes POST http://localhost:5000/api/auth/register
router.post('/register', registerUser); 
router.post('/login', loginUser);

module.exports = router;