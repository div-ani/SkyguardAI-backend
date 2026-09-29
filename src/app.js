/* ==========================================================
   app.js – builds the Express app: middleware, routes, error handler.
   (Starting the server and connecting to MongoDB happens in server.js.)
   ========================================================== */
const express = require('express');
const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config/env');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', service: 'skyguard-ai-backend' }));
app.use('/api', apiRoutes);

app.use(errorHandler); // must be last

module.exports = app;
