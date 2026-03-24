const express = require('express');
const router = express.Router();
const { addAddress, getAddresses, deleteAddress } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/address').post(protect, addAddress).get(protect, getAddresses);
router.route('/address/:id').delete(protect, deleteAddress);

module.exports = router;
