/* ==========================================================
   routes/index.js – wires every route file under /api/*
   Add a new feature? Add one line here that points at a new
   routes file, and put the file next to these.
   ========================================================== */
const express = require('express');

const router = express.Router();

router.use('/stations', require('./stationRoutes'));
router.use('/sensors', require('./sensorRoutes'));
router.use('/readings', require('./readingRoutes'));
router.use('/anomalies', require('./anomalyRoutes'));
router.use('/stats', require('./statsRoutes'));

module.exports = router;
