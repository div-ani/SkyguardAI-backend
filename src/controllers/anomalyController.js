/* ==========================================================
   anomalyController.js – the anomaly log + acknowledge workflow
   ========================================================== */
const Anomaly = require('../models/Anomaly');
const { DEFAULT_LOG_LIMIT } = require('../config/app');

/** GET /api/anomalies?limit=25&station=LKO */
async function listAnomalies(req, res, next) {
  try {
    const limit = Number(req.query.limit) || DEFAULT_LOG_LIMIT;
    const filter = {};
    if (req.query.station) filter.stationId = req.query.station;

    const anomalies = await Anomaly.find(filter).sort({ occurredAt: -1 }).limit(limit).lean();
    res.json(anomalies);
  } catch (err) { next(err); }
}

/** PATCH /api/anomalies/:id/acknowledge */
async function acknowledgeAnomaly(req, res, next) {
  try {
    const anomaly = await Anomaly.findByIdAndUpdate(req.params.id, { acknowledged: true }, { new: true });
    if (!anomaly) return res.status(404).json({ error: 'Anomaly not found' });
    res.json(anomaly);
  } catch (err) { next(err); }
}

module.exports = { listAnomalies, acknowledgeAnomaly };
