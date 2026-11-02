const express = require('express');
const router = express.Router();
const { getSmartMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:itemId', protect, getSmartMatches);

module.exports = router;