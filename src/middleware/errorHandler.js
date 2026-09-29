/* ==========================================================
   errorHandler.js – catches anything passed to next(err) and
   returns a clean JSON error instead of crashing the server.
   Must be registered LAST in app.js.
   ========================================================== */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

module.exports = errorHandler;
