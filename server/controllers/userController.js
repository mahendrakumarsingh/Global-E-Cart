const User = require('../models/User');

// @desc    Add a new address
// @route   POST /api/users/address
// @access  Private
const addAddress = async (req, res) => {
    try {
        console.log('Add Address Request Body:', req.body); // DEBUG
        const user = await User.findById(req.user._id);

        if (user) {
            const address = {
                fullName: req.body.fullName,
                mobile: req.body.mobile,
                pinCode: req.body.pinCode,
                flat: req.body.flat,
                area: req.body.area,
                city: req.body.city,
                state: req.body.state,
                addressType: req.body.addressType,
                isDefault: req.body.isDefault || false,
            };

            // If this address is set as default, unset others
            if (address.isDefault) {
                user.addresses.forEach(addr => addr.isDefault = false);
            } else if (user.addresses.length === 0) {
                // If it's the first address, make it default automatically
                address.isDefault = true;
            }

            user.addresses.push(address);
            const updatedUser = await user.save();

            res.status(201).json(updatedUser.addresses);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user addresses
// @route   GET /api/users/address
// @access  Private
const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.addresses);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an address
// @route   DELETE /api/users/address/:id
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.addresses = user.addresses.filter(
                (addr) => addr._id.toString() !== req.params.id
            );
            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addAddress, getAddresses, deleteAddress };
