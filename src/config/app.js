/* ==========================================================
   app.js (config) – small settings for the API's own behaviour,
   as opposed to sensors.js which is about the weather stations.
   ========================================================== */
module.exports = {
  DEFAULT_READING_LIMIT: 120,     // readings returned per station+sensor if not specified
  DEFAULT_LOG_LIMIT: 25,          // anomaly log entries returned if not specified
  ACTIVE_LOOKBACK_MINUTES: 30,    // "active" anomaly = flagged within this many minutes
};
