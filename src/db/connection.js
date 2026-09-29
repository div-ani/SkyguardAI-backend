/* ==========================================================
   connection.js – opens the MongoDB connection.
   ========================================================== */
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/env');

async function connectDB() {
  mongoose.connection.on('connected', () => console.log(`MongoDB connected: ${MONGO_URI}`));
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));

  await mongoose.connect(MONGO_URI);
}

module.exports = connectDB;
