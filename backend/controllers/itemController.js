const Item = require('../models/Item');

// @desc    Get all items (with optional search filter)
// @route   GET /api/items
const getItems = async (req, res) => {
  try {
    const { search, type } = req.query;
    let query = {};

    if (type && type !== 'ALL') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Create a new item
// @route   POST /api/items
const createItem = async (req, res) => {
  try {
    const { title, description, category, location, type } = req.body;

    if (!title || !description || !location || !type) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const item = await Item.create({
      title,
      description,
      category,
      location,
      type,
      image: image || '',
      user: req.user._id,
    });

    const populatedItem = await item.populate('user', 'name email');
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get logged in user's items
// @route   GET /api/items/my-items
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update item status (OPEN -> RESOLVED)
// @route   PATCH /api/items/:id/status
const updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify user owns the item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this item' });
    }

    item.status = item.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { 
  getItems, 
  createItem, 
  getMyItems, 
  updateItemStatus 
};