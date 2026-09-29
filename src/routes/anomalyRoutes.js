const express = require('express');
const { listAnomalies, acknowledgeAnomaly } = require('../controllers/anomalyController');

const router = express.Router();
router.get('/', listAnomalies);                    // GET   /api/anomalies?limit=&station=
router.patch('/:id/acknowledge', acknowledgeAnomaly); // PATCH /api/anomalies/:id/acknowledge
module.exports = router;
