const Deal = require('../models/Deal');
const { scrapeDeals } = require('../utils/scraperService');

// @desc    Get all deals
// @route   GET /api/deals
// @access  Public
exports.getDeals = async (req, res) => {
    try {
        let deals = await Deal.find();

        // If no deals exist, populate them for the first time
        if (deals.length === 0) {
            deals = await scrapeDeals();
        }

        // Check if we have active Hero Deals
        const hasHeroDeals = deals.some(d => d.isHeroDeal && new Date(d.endTime) > new Date());

        if (!hasHeroDeals && deals.length > 0) {
            // Promote random 3 deals to Hero status
            const shuffled = [...deals].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);

            for (const deal of selected) {
                deal.isHeroDeal = true;
                // Set endTime to 12-24 hours from now
                const hours = 12 + Math.floor(Math.random() * 12);
                deal.endTime = new Date(Date.now() + hours * 60 * 60 * 1000);

                // Use a high-quality placeholder if original image is low res or just use original
                // deal.heroImage = deal.image; 

                await deal.save();
            }
            // Re-fetch to get updated data
            deals = await Deal.find();
        }

        res.json(deals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Force refresh deals (Run scraper)
// @route   POST /api/deals/refresh
// @access  Private/Admin
exports.refreshDeals = async (req, res) => {
    try {
        const deals = await scrapeDeals();
        res.json({ message: 'Deals refreshed', count: deals.length, deals });
    } catch (error) {
        res.status(500).json({ message: 'Scraping Failed' });
    }
};
