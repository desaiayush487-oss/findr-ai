const Item = require('../models/Item');

// Helper function to calculate basic keyword overlap / match score
const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;

  // 1. Category match (High weight)
  if (lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
    score += 40;
  }

  // 2. Location match (Medium weight)
  if (
    lostItem.location.toLowerCase().includes(foundItem.location.toLowerCase()) ||
    foundItem.location.toLowerCase().includes(lostItem.location.toLowerCase())
  ) {
    score += 30;
  }

  // 3. Title/Description keyword overlap
  const lostKeywords = `${lostItem.title} ${lostItem.description}`.toLowerCase().split(/\s+/);
  const foundKeywords = `${foundItem.title} ${foundItem.description}`.toLowerCase().split(/\s+/);

  const commonKeywords = lostKeywords.filter(
    (word) => word.length > 3 && foundKeywords.includes(word)
  );

  score += Math.min(commonKeywords.length * 10, 30);

  return Math.min(score, 100); // Cap at 100%
};

// @desc    Find smart matches for a given item ID
// @route   GET /api/matches/:itemId
const getSmartMatches = async (req, res) => {
  try {
    const targetItem = await Item.findById(req.params.itemId);

    if (!targetItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Look for opposite report type (If target is LOST, search FOUND, and vice versa)
    const oppositeType = targetItem.type === 'LOST' ? 'FOUND' : 'LOST';

    const potentialItems = await Item.find({
      type: oppositeType,
      status: 'OPEN',
      _id: { $ne: targetItem._id },
    }).populate('user', 'name email');

    // Calculate match scores
    const matches = potentialItems
      .map((item) => {
        const score = calculateMatchScore(targetItem, item);
        return { item, matchScore: score };
      })
      .filter((match) => match.matchScore >= 30) // Only return matches with score >= 30%
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { getSmartMatches };