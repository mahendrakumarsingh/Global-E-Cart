const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Sync cart with backend for logged-in user
router.post('/sync', protect, async (req, res) => {
  try {
    req.user.cart = req.body.cart || [];
    await req.user.save();
    res.json({ message: 'Cart synced' });
  } catch (error) {
    console.error('Cart Sync Error:', error); // DEBUG
    res.status(500).json({ message: 'Error syncing cart', error: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user.cart || []);
});

module.exports = router;
