const Deal = require('../models/Deal');

// Mock data generator helper
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const sampleTitles = [
    "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    "Samsung Galaxy Watch 6 classic",
    "Nike Air Jordan 1 Retro High",
    "Apple MacBook Air M2 Chip",
    "Dyson V15 Detect Cordless Vacuum",
    "PlayStation 5 Console",
    "Adidas Ultraboost Light Running Shoes",
    "Kindle Paperwhite (16 GB)",
    "Instant Pot Duo Plus 9-in-1",
    "Logitech MX Master 3S Mouse"
];

const sampleImages = [
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop", // Headphones
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop", // Watch
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop", // Shoes
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop", // Laptop
    "https://images.unsplash.com/photo-1522336572468-971c5430be65?q=80&w=1000&auto=format&fit=crop", // Home appliance generic
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop", // Gaming
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop", // Shoes 2
    "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?q=80&w=1000&auto=format&fit=crop", // Tablet/Reader
    "https://images.unsplash.com/photo-1588636666172-1262d497ba43?q=80&w=1000&auto=format&fit=crop", // Kitchen
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop"  // Mouse/Acc
];

const categories = [
    "Electronics • Audio", "Accessories • Watches", "Fashion • Shoes",
    "Computing • Laptops", "Home Decor • Appliances", "Gaming • Consoles",
    "Fashion • Activewear", "Electronics • Tablets", "Appliances • Kitchen", "Computing • Accessories"
];

const sources = [
    { name: 'Amazon', color: 'amazon' },
    { name: 'Flipkart', color: 'flipkart' },
    { name: 'Myntra', color: 'myntra' }
];

const scrapeDeals = async () => {
    console.log('Starting deal scrape/refresh...');

    // In a real implementation, you would use puppeteer or axios to fetch here
    // For now, we generate fresh random deals to simulate a daily update
    const newDeals = [];

    for (let i = 0; i < 12; i++) {
        const randomIdx = getRandomInt(0, sampleTitles.length - 1);
        const sourceIdx = getRandomInt(0, sources.length - 1);
        const originalPrice = getRandomInt(50, 2000);
        const discountPercent = getRandomInt(10, 80);
        const price = Math.floor(originalPrice * (1 - discountPercent / 100));

        newDeals.push({
            title: sampleTitles[randomIdx],
            image: sampleImages[randomIdx],
            price: price,
            originalPrice: originalPrice,
            discount: `${discountPercent}% OFF`,
            source: sources[sourceIdx].name,
            color: sources[sourceIdx].color,
            category: categories[randomIdx],
            link: '#'
        });
    }

    // Clear old deals and insert new ones
    await Deal.deleteMany({});
    await Deal.insertMany(newDeals);

    console.log('Deals refreshed successfully!');
    return newDeals;
};

module.exports = { scrapeDeals };
