# SkyGuard AI – Backend (Node.js + MongoDB)
API and anomaly-detection engine for SIH 2026 PS 26073.

## Setup
```bash
npm install
cp .env.example .env        # then edit .env if needed (e.g. your MongoDB URL)
npm run seed                # optional: fills the database with 2 hours of demo data
npm run dev                 # starts the server with auto-reload (or: npm start)
```
The server needs a running MongoDB (local install, or a free MongoDB Atlas cluster —
just put its connection string in `MONGO_URI` in `.env`).

With `ENABLE_SIMULATOR=true` (the default) the server generates its own fake readings
every few seconds, so the API has live data with no real hardware and no seeding needed.

## Where to change things
| I want to…                              | Edit                              |
|------------------------------------------|------------------------------------|
| Add a station / sensor                    | `src/config/sensors.js`           |
| Change the spike / stuck-sensor rules     | `src/services/detector.js`        |
| Use a real ML model instead of z-scores   | `src/services/detector.js`        |
| Change how fake demo data is generated    | `src/services/simulator.js`       |
| Change API behaviour (limits, lookback)   | `src/config/app.js`               |
| Add a new API endpoint                    | add a controller + route, then register it in `src/routes/index.js` |
| Change server port / database URL         | `.env`                            |

## Project layout
```
src/
  config/     settings (env vars, sensors/stations, app limits)
  db/         MongoDB connection
  models/     Mongoose schemas: Reading, Anomaly
  services/   business logic (detection, ingestion, simulator) — no Express code here
  controllers/ turn HTTP requests into service/model calls
  routes/     URL -> controller wiring
  middleware/ error handler
  app.js      builds the Express app
  server.js   connects to MongoDB and starts listening (the file you run)
scripts/
  seed.js     fills the database with demo history
```
Each layer only talks to the one below it: routes call controllers, controllers call
services and models, services call models. This makes it easy to change one layer
(e.g. swap the detector for a real ML model) without touching the others.

## API reference

| Method & path                          | Purpose |
|-----------------------------------------|---------|
| `GET /api/stations`                     | All stations, each flagged if it has a recent anomaly |
| `GET /api/stations/:id`                 | One station with its latest reading per sensor |
| `GET /api/sensors`                      | Sensor definitions (name, unit, colour data) |
| `GET /api/readings?station=&sensor=&limit=` | Historical readings for one station + sensor, oldest first, each tagged with `anomalyType` |
| `POST /api/readings`                    | Submit a new reading: `{ "stationId": "LKO", "sensorKey": "temp", "value": 31.2 }` |
| `GET /api/anomalies?limit=&station=`    | Anomaly log, newest first |
| `PATCH /api/anomalies/:id/acknowledge`  | Mark an anomaly as acknowledged |
| `GET /api/stats`                        | The 4 dashboard KPI numbers |

Example:
```bash
curl -X POST http://localhost:4000/api/readings \
  -H "Content-Type: application/json" \
  -d '{"stationId":"LKO","sensorKey":"temp","value":41.5}'
```

## Connecting the frontend
In the frontend's `js/simulator.js`, replace the fake-data functions with `fetch()` calls
to `GET /api/readings` and `POST /api/readings` on this server, and point `js/detector.js`'s
severity/threshold logic at `GET /api/anomalies` and `GET /api/stats` if you want the
backend to be the single source of truth instead of recomputing anomalies in the browser.
