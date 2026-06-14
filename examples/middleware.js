/**
 * Example: Using Condense as Express Middleware
 * Mount Condense on an existing Express application
 */

const express = require('express');
const { condenseApp } = require('../src/index');

const app = express();

// Mount Condense under /v1/optimize path
app.use('/v1', condenseApp);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Example API with Condense' });
});

// Your other routes
app.get('/', (req, res) => {
  res.json({ message: 'API with integrated Condense optimization' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✨ App running on http://localhost:${PORT}`);
  console.log(`📤 POST files to http://localhost:${PORT}/v1/optimize`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});
