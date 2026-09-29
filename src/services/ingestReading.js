/* ==========================================================
   ingestReading.js – the ONE place a new sensor value enters the system.
   Called by: the POST /api/readings route (real stations) AND
   the built-in simulator (demo data). Both go through here so
   detection and storage always behave the same way.
   ========================================================== */
const Reading = require('../models/Reading');
const Anomaly = require('../models/Anomaly');
const { classifyReading, severityFor } = require('./detector');
const { DETECTION } = require('../config/sensors');

/**
 * Saves one new reading, running anomaly detection against recent history.
 * @param {string} stationId
 * @param {string} sensorKey
 * @param {number} value
 * @param {Date}   [recordedAt]  defaults to now
 * @returns {Promise<Document>}  the saved Reading
 */
async function ingestReading(stationId, sensorKey, value, recordedAt = new Date()) {
  // Recent history for this exact station + sensor, oldest first
  const history = await Reading.find({ stationId, sensorKey })
    .sort({ recordedAt: -1 })
    .limit(DETECTION.DETECTION_WINDOW)
    .select('value')
    .lean();
  const pastValues = history.reverse().map((r) => r.value);

  const { mean, std, zScore, anomalyType } = classifyReading(value, pastValues);

  const reading = await Reading.create({
    stationId, sensorKey, value, recordedAt, mean, std, zScore, anomalyType,
  });

  if (anomalyType) {
    await Anomaly.create({
      stationId, sensorKey, reading: reading._id,
      anomalyType, value, zScore,
      severity: severityFor(anomalyType, zScore),
      occurredAt: recordedAt,
    });
  }

  // Keep only the most recent HISTORY_LIMIT readings per station+sensor
  const excess = await Reading.find({ stationId, sensorKey })
    .sort({ recordedAt: -1 })
    .skip(DETECTION.HISTORY_LIMIT)
    .select('_id');
  if (excess.length) await Reading.deleteMany({ _id: { $in: excess.map((r) => r._id) } });

  return reading;
}

module.exports = ingestReading;
