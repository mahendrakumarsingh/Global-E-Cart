const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: String, required: true },
    source: { type: String, enum: ['Amazon', 'Flipkart', 'Myntra'], required: true },
    category: { type: String, required: true },
    color: { type: String, default: 'blue-600' }, // For UI theming
    link: { type: String, default: '#' },
    endTime: { type: Date, required: false }, // For countdown
    isHeroDeal: { type: Boolean, default: false }, // For Hero Carousel
    heroImage: { type: String, required: false }, // Large image for Hero
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deal', dealSchema);
