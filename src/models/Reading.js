/* ==========================================================
   Reading – one sensor value at one point in time.
   Anomaly fields (mean/std/zScore/anomalyType) are filled in by
   the detector service AT THE TIME the reading is saved, so the
   log and dashboard don't have to recompute them on every request.
   ========================================================== */
const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  stationId: { type: String, required: true, index: true },   // e.g. 'LKO'
  sensorKey: { type: String, required: true, index: true },   // e.g. 'temp'
  value: { type: Number, required: true },
  recordedAt: { type: Date, required: true, default: Date.now, index: true },

  // Filled in by services/detector.js — see that file to change the rules
  mean: { type: Number, default: null },
  std: { type: Number, default: null },
  zScore: { type: Number, default: 0 },
  anomalyType: { type: String, enum: ['spike', 'stuck', null], default: null },
}, { timestamps: true });

// The dashboard always asks for "the last N readings for station X, sensor Y"
readingSchema.index({ stationId: 1, sensorKey: 1, recordedAt: -1 });

module.exports = mongoose.model('Reading', readingSchema);
