/* ==========================================================
   env.js – reads the .env file into one plain object.
   Every other file should read settings from here, not from
   process.env directly, so all the defaults live in one place.
   ========================================================== */
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skyguard_ai',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '*',
  ENABLE_SIMULATOR: process.env.ENABLE_SIMULATOR !== 'false', // default: on
};
