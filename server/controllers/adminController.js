const Order = require('../models/Order');
const User = require('../models/User');

exports.analytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalSales = totalSalesAgg[0] ? totalSalesAgg[0].total : 0;
    const totalUsers = await User.countDocuments();

    const monthsAgg = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = monthsAgg.map(m => m._id);
    const revenue = monthsAgg.map(m => m.revenue);

    res.json({ totalSales, totalOrders, totalUsers, months, revenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
