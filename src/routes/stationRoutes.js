const express = require('express');
const { listStations, getStation } = require('../controllers/stationController');

const router = express.Router();
router.get('/', listStations);       // GET /api/stations
router.get('/:id', getStation);      // GET /api/stations/:id
module.exports = router;
