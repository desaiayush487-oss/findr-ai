const express = require('express');
const router = express.Router();
const { 
  getItems, 
  createItem, 
  getMyItems, 
  updateItemStatus 
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.get('/my-items', protect, getMyItems);
router.patch('/:id/status', protect, updateItemStatus);

module.exports = router;