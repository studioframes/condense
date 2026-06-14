/**
 * Example: Running Condense as a Standalone CLI Server
 * Usage: node examples/cli.js
 * Then POST files to http://localhost:3000/optimize
 */

const { condenseApp } = require('../src/index');
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

// Mount Condense router
app.use('/', condenseApp);

app.listen(PORT, () => {
  console.log(`🚀 Condense running on http://localhost:${PORT}`);
  console.log(`📤 POST files to http://localhost:${PORT}/optimize`);
  console.log(`\nExample with curl:`);
  console.log(`  curl -F "file=@image.png" -F "method=quality" http://localhost:${PORT}/optimize`);
  console.log(`\nPress Ctrl+C to stop`);
});
