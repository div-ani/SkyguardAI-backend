/* ==========================================================
   Anomaly – a log entry created whenever a Reading is flagged.
   Kept as its own collection so the anomaly log and any
   acknowledge/resolve workflow don't need to scan every reading.
   ========================================================== */
const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema({
  stationId: { type: String, required: true, index: true },
  sensorKey: { type: String, required: true },
  reading: { type: mongoose.Schema.Types.ObjectId, ref: 'Reading', required: true },

  anomalyType: { type: String, enum: ['spike', 'stuck'], required: true },
  value: { type: Number, required: true },
  zScore: { type: Number, default: 0 },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  occurredAt: { type: Date, required: true, index: true },

  acknowledged: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Anomaly', anomalySchema);
