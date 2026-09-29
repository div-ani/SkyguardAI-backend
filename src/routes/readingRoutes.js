const express = require('express');
const { listReadings, createReading } = require('../controllers/readingController');

const router = express.Router();
router.get('/', listReadings);       // GET  /api/readings?station=&sensor=&limit=
router.post('/', createReading);     // POST /api/readings  (a station submitting a value)
module.exports = router;
