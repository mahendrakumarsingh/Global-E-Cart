const express = require('express');
const router = express.Router();
const { getDeals, refreshDeals } = require('../controllers/dealController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getDeals);
router.post('/refresh', protect, admin, refreshDeals);

module.exports = router;
