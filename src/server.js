/* ==========================================================
   server.js – the entry point. Run with: npm start (or npm run dev)
   Connects to MongoDB, starts the simulator (if enabled), then listens.
   ========================================================== */
const app = require('./app');
const connectDB = require('./db/connection');
const startSimulator = require('./services/simulator');
const { PORT, ENABLE_SIMULATOR } = require('./config/env');

async function main() {
  await connectDB();

  if (ENABLE_SIMULATOR) startSimulator();

  app.listen(PORT, () => console.log(`SkyGuard AI backend listening on http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
