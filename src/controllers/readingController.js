/* ==========================================================
   readingController.js – read historical readings, and accept new ones
   ========================================================== */
const Reading = require('../models/Reading');
const ingestReading = require('../services/ingestReading');
const { findStation, findSensor } = require('../config/sensors');
const { DEFAULT_READING_LIMIT } = require('../config/app');

/** GET /api/readings?station=LKO&sensor=temp&limit=120 */
async function listReadings(req, res, next) {
  try {
    const { station: stationId, sensor: sensorKey } = req.query;
    const limit = Number(req.query.limit) || DEFAULT_READING_LIMIT;

    if (!stationId || !sensorKey) {
      return res.status(400).json({ error: 'Query params "station" and "sensor" are required' });
    }
    if (!findStation(stationId)) return res.status(404).json({ error: `Unknown station "${stationId}"` });
    if (!findSensor(sensorKey)) return res.status(404).json({ error: `Unknown sensor "${sensorKey}"` });

    const readings = await Reading.find({ stationId, sensorKey })
      .sort({ recordedAt: -1 })
      .limit(limit)
      .lean();

    res.json(readings.reverse()); // oldest first, easiest for charting
  } catch (err) { next(err); }
}

/** POST /api/readings  body: { stationId, sensorKey, value, recordedAt? }
 *  This is the endpoint a REAL weather station calls to submit a value. */
async function createReading(req, res, next) {
  try {
    const { stationId, sensorKey, value, recordedAt } = req.body;

    if (!stationId || !sensorKey || typeof value !== 'number') {
      return res.status(400).json({ error: '"stationId", "sensorKey" and numeric "value" are required' });
    }
    if (!findStation(stationId)) return res.status(404).json({ error: `Unknown station "${stationId}"` });
    if (!findSensor(sensorKey)) return res.status(404).json({ error: `Unknown sensor "${sensorKey}"` });

    const reading = await ingestReading(stationId, sensorKey, value, recordedAt ? new Date(recordedAt) : undefined);
    res.status(201).json(reading);
  } catch (err) { next(err); }
}

module.exports = { listReadings, createReading };
