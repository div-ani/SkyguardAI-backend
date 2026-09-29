const express = require('express');
const { listSensors } = require('../controllers/sensorController');

const router = express.Router();
router.get('/', listSensors);        // GET /api/sensors
module.exports = router;
