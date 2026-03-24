const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Optional reference
  deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },       // Optional reference
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 }
});

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  pinCode: { type: String, required: true },
  flat: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  addressType: { type: String, enum: ['Home', 'Office'], default: 'Home' },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    cart: [cartItemSchema],
    addresses: [addressSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
