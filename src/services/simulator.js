/* ==========================================================
   simulator.js – generates believable fake readings so the API
   has live data without any real hardware. Used only when
   ENABLE_SIMULATOR=true in .env.

   >>> Turn this off in production (ENABLE_SIMULATOR=false) and
       have real weather stations call POST /api/readings instead. <<<
   ========================================================== */
const { STATIONS, SENSORS, SIMULATOR_TICK_MS } = require('../config/sensors');
const ingestReading = require('./ingestReading');

let stepCounter = 0;

/** A believable value: base + location offset + daily wave + random noise */
function generateValue(station, sensor, step) {
  const offset = station.offsets[sensor.key] || 0;
  const wave = sensor.swing * Math.sin(step / 14 + station.phase);
  const noise = (Math.random() - 0.5) * sensor.noise;
  const value = Math.max(0, sensor.base + offset + wave + noise);
  return sensor.key === 'hum' ? Math.min(100, value) : value; // humidity max 100 %
}

/** One tick: every station gets one new reading for every sensor */
async function tick() {
  stepCounter += 1;
  for (const station of STATIONS) {
    for (const sensor of SENSORS) {
      let value = generateValue(station, sensor, stepCounter);

      // Occasionally throw in a natural spike, so the demo has something to show
      if (Math.random() < 0.01) {
        const direction = Math.random() < 0.5 ? 1 : -1;
        value = Math.max(0, value + direction * sensor.swing * (3 + Math.random() * 3));
      }

      await ingestReading(station.id, sensor.key, value);
    }
  }
}

function startSimulator() {
  console.log(`Simulator started (a new batch of readings every ${SIMULATOR_TICK_MS / 1000}s)`);
  tick().catch((err) => console.error('Simulator tick failed:', err.message));
  return setInterval(() => tick().catch((err) => console.error('Simulator tick failed:', err.message)), SIMULATOR_TICK_MS);
}

module.exports = startSimulator;
