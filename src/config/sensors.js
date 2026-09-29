/* ==========================================================
   sensors.js – every station, every sensor, and every detection
   setting lives here. This mirrors the frontend's config.js on
   purpose, so the two projects agree on what a "spike" is.

   To add a station or sensor: add one object to the list below.
   Nothing else in the backend needs to change.
   ========================================================== */

const DETECTION = {
  DEFAULT_THRESHOLD: 3.5,   // z-score above which a reading counts as a spike
  DETECTION_WINDOW: 25,     // past readings used to compute the rolling mean/std
  STUCK_RUN: 6,             // identical readings in a row = stuck sensor
  HISTORY_LIMIT: 500,       // readings kept per station+sensor (oldest deleted)
};

const SENSORS = [
  { key: 'temp', name: 'Temperature',     unit: '°C',   base: 29,   swing: 5,   noise: 0.6 },
  { key: 'hum',  name: 'Humidity',        unit: '%',    base: 62,   swing: 14,  noise: 2 },
  { key: 'pres', name: 'Pressure',        unit: 'hPa',  base: 1008, swing: 2.5, noise: 0.3 },
  { key: 'wind', name: 'Wind speed',      unit: 'km/h', base: 14,   swing: 6,   noise: 2.5 },
  { key: 'rain', name: 'Rainfall',        unit: 'mm',   base: 2,    swing: 1,   noise: 0.6 },
  { key: 'sol',  name: 'Solar radiation', unit: 'W/m²', base: 420,  swing: 380, noise: 30 },
];

const STATIONS = [
  { id: 'LKO', name: 'Lucknow',     phase: 0, offsets: { temp: 0,   hum: 0,    pres: 0 } },
  { id: 'KDR', name: 'Kedarnath',   phase: 1, offsets: { temp: -16, hum: 19,   pres: 24 } },
  { id: 'MAA', name: 'Chennai',     phase: 2, offsets: { temp: 3,   hum: -3.6, pres: -4.5 } },
  { id: 'JSA', name: 'Jaisalmer',   phase: 3, offsets: { temp: 6,   hum: -7.2, pres: -9 } },
  { id: 'CHE', name: 'Cherrapunji', phase: 4, offsets: { temp: -3,  hum: 3.6,  pres: 4.5 } },
];

// How often the built-in simulator generates a reading, per sensor (milliseconds)
const SIMULATOR_TICK_MS = 5000;

function findSensor(key) {
  return SENSORS.find((s) => s.key === key);
}
function findStation(id) {
  return STATIONS.find((s) => s.id === id);
}

module.exports = { DETECTION, SENSORS, STATIONS, SIMULATOR_TICK_MS, findSensor, findStation };
