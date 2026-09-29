/* ==========================================================
   stationController.js – station list + per-station status
   ========================================================== */
const Reading = require('../models/Reading');
const { STATIONS, SENSORS } = require('../config/sensors');
const { ACTIVE_LOOKBACK_MINUTES } = require('../config/app');

/** GET /api/stations – every station plus whether it has a recent anomaly */
async function listStations(req, res, next) {
  try {
    const since = new Date(Date.now() - ACTIVE_LOOKBACK_MINUTES * 60 * 1000);
    const alerting = await Reading.distinct('stationId', { anomalyType: { $ne: null }, recordedAt: { $gte: since } });
    const alertingSet = new Set(alerting);

    const stations = STATIONS.map((station) => ({
      ...station,
      hasActiveAnomaly: alertingSet.has(station.id),
    }));

    res.json(stations);
  } catch (err) { next(err); }
}

/** GET /api/stations/:id – one station + its latest reading per sensor */
async function getStation(req, res, next) {
  try {
    const station = STATIONS.find((s) => s.id === req.params.id);
    if (!station) return res.status(404).json({ error: `Unknown station "${req.params.id}"` });

    const latestReadings = await Promise.all(SENSORS.map(async (sensor) => {
      const latest = await Reading.findOne({ stationId: station.id, sensorKey: sensor.key })
        .sort({ recordedAt: -1 }).lean();
      return { sensor, latest };
    }));

    res.json({ ...station, sensors: latestReadings });
  } catch (err) { next(err); }
}

module.exports = { listStations, getStation };
