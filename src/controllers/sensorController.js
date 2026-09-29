/* ==========================================================
   sensorController.js – exposes the static sensor definitions
   ========================================================== */
const { SENSORS } = require('../config/sensors');

/** GET /api/sensors */
function listSensors(req, res) {
  res.json(SENSORS);
}

module.exports = { listSensors };
