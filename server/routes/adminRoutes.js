const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { analytics } = require('../controllers/adminController');

router.get('/analytics', protect, admin, analytics);

module.exports = router;
