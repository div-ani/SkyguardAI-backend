/* ==========================================================
   statsController.js – the four headline numbers for the dashboard
   ========================================================== */
const Reading = require('../models/Reading');
const Anomaly = require('../models/Anomaly');
const { STATIONS, SENSORS } = require('../config/sensors');
const { ACTIVE_LOOKBACK_MINUTES } = require('../config/app');

/** GET /api/stats */
async function getStats(req, res, next) {
  try {
    const since = new Date(Date.now() - ACTIVE_LOOKBACK_MINUTES * 60 * 1000);

    const [activeAnomalies, totalReadings, flaggedReadings] = await Promise.all([
      Anomaly.countDocuments({ occurredAt: { $gte: since } }),
      Reading.countDocuments({}),
      Reading.countDocuments({ anomalyType: { $ne: null } }),
    ]);

    const dataQuality = totalReadings ? (100 * (1 - flaggedReadings / totalReadings)).toFixed(1) : '100.0';

    res.json({
      stationsOnline: `${STATIONS.length}/${STATIONS.length}`,
      activeAnomalies,
      sensorsMonitored: STATIONS.length * SENSORS.length,
      dataQuality,
    });
  } catch (err) { next(err); }
}

module.exports = { getStats };
