'use strict';

const express = require('express');
const os = require('os');
const optimizeController = require('./controllers/optimizeController');
const upload = require('./middleware/upload');
const telemetry = require('./services/telemetryService');
const { listPresets } = require('./services/presetService');

const app = express();

// Body parsers for JSON and URL-encoded bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Strict Timeout Middleware (30 seconds)
app.use((req, res, next) => {
  const TIMEOUT_MS = 30000;
  req.setTimeout(TIMEOUT_MS, () => {
    const err = new Error('Request Timeout: Upload took too long.');
    err.status = 408;
    next(err);
  });
  res.setTimeout(TIMEOUT_MS, () => {
    if (!res.headersSent) {
      const err = new Error('Response Timeout: Processing took too long.');
      err.status = 503;
      next(err);
    }
  });
  next();
});

// Health metrics
app.get('/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'UP',
    uptime: process.uptime(),
    memory: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
    },
    cpuLoad: os.loadavg(),
    platform: os.platform(),
    arch: os.arch(),
  });
});

// Telemetry & ROI Metrics
app.get('/metrics', (req, res) => {
  res.json(telemetry.getMetrics());
});

app.get('/telemetry', (req, res) => {
  res.json(telemetry.getMetrics());
});

// Presets Registry
app.get('/presets', (req, res) => {
  res.json(listPresets());
});

// Coordinated Token Mangling Endpoint
app.post('/mangle', optimizeController.handleMangleTokens);

// SVG Spritesheet Packing Endpoint
app.post('/sprites', optimizeController.handleSvgSprites);

// Primary Optimization Endpoint
app.post('/optimize', upload.single('file'), optimizeController.optimizeFile);

// Global Error Handler
app.use((err, req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 50MB.' });
  }
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  } else {
    res.end();
  }
});

module.exports = app;
