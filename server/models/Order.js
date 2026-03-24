const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  qty: Number
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: { type: Object },
    paymentMethod: { type: String },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Delivered'],
      default: 'Pending'
    },
    paidAt: { type: Date },
    deliveredAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
