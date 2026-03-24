require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

connectDB();

const seed = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({ name: 'Admin', email: 'admin@store.com', password: adminPassword, isAdmin: true });

    const products = [
      { title: 'Wireless Headphones', description: 'High quality sound', price: 9900, image: '', countInStock: 10 },
      { title: 'Sneakers', description: 'Comfortable running shoes', price: 7500, image: '', countInStock: 20 },
      { title: 'Smart Watch', description: 'Track your activity', price: 12900, image: '', countInStock: 5 }
    ];

    await Product.insertMany(products);

    console.log('Seeded DB');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
