const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, paid } = req.body;

    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'No order items' });

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: paid ? 'Paid' : 'Pending',
      paidAt: paid ? Date.now() : null
    });

    // Optionally reduce stock
    for (const item of orderItems) {
      if (item.product) {
        const prod = await Product.findById(item.product);
        if (prod) {
          prod.countInStock = Math.max(0, prod.countInStock - item.qty);
          await prod.save();
        }
      }
    }

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const { status } = req.body; // expect one of Pending, Paid, Shipped, Delivered
  order.status = status;
  if (status === 'Delivered') order.deliveredAt = Date.now();
  await order.save();
  res.json(order);
};
