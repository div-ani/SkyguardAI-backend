/* ==========================================================
   seed.js – wipes existing data and inserts ~2 hours of history
   per station/sensor, with a few obvious spikes planted in, so
   the dashboard has something to show immediately.

   Run with: npm run seed
   ========================================================== */
const mongoose = require('mongoose');
const connectDB = require('../src/db/connection');
const Reading = require('../src/models/Reading');
const Anomaly = require('../src/models/Anomaly');
const ingestReading = require('../src/services/ingestReading');
const { STATIONS, SENSORS } = require('../src/config/sensors');

const READINGS_PER_SENSOR = 120;
const MINUTE = 60 * 1000;

// A few (station, sensor, index-from-start, value-added) spikes for demo purposes
const SEEDED_SPIKES = [
  { stationId: 'LKO', sensorKey: 'temp', index: 95, delta: 9 },
  { stationId: 'KDR', sensorKey: 'pres', index: 82, delta: -14 },
  { stationId: 'JSA', sensorKey: 'wind', index: 105, delta: 40 },
  { stationId: 'CHE', sensorKey: 'rain', index: 98, delta: 18 },
];

function baseValue(station, sensor, step) {
  const offset = station.offsets[sensor.key] || 0;
  const wave = sensor.swing * Math.sin(step / 14 + station.phase);
  const noise = (Math.random() - 0.5) * sensor.noise;
  const value = Math.max(0, sensor.base + offset + wave + noise);
  return sensor.key === 'hum' ? Math.min(100, value) : value;
}

async function seed() {
  await connectDB();
  console.log('Clearing existing readings and anomalies...');
  await Reading.deleteMany({});
  await Anomaly.deleteMany({});

  const now = Date.now();

  for (const station of STATIONS) {
    for (const sensor of SENSORS) {
      console.log(`Seeding ${station.name} / ${sensor.name}...`);
      for (let i = 0; i < READINGS_PER_SENSOR; i += 1) {
        let value = baseValue(station, sensor, i);

        const spike = SEEDED_SPIKES.find((s) => s.stationId === station.id && s.sensorKey === sensor.key && s.index === i);
        if (spike) value = Math.max(0, value + spike.delta);

        const recordedAt = new Date(now - (READINGS_PER_SENSOR - i) * MINUTE);
        // eslint-disable-next-line no-await-in-loop
        await ingestReading(station.id, sensor.key, value, recordedAt);
      }
    }
  }

  console.log('Done.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
