'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fflate = require('fflate');
const { optimizeZip } = require('../src/services/archiveService');

test('archiveService - optimizes in-memory zip archive', async () => {
  // Construct sample zip archive in memory
  const sampleFiles = {
    'index.html': fflate.strToU8('<!DOCTYPE html><html>   <head><title>Test</title></head>   <body>   <h1>   Hello World  </h1> </body></html>'),
    'styles.css': fflate.strToU8('body {\n  margin: 0px;\n  padding: 0px;\n  color: #ffffff;\n}\n.header {\n  font-size: 16px;\n}'),
    'app.js': fflate.strToU8('function calculateTotal(items) {\n  var sum = 0;\n  for (var i = 0; i < items.length; i++) {\n    sum += items[i];\n  }\n  return sum;\n}'),
    'data.json': fflate.strToU8(JSON.stringify({ message: 'hello', count: 42, active: true }, null, 4)),
  };

  const initialZip = fflate.zipSync(sampleFiles, { level: 1 });
  const initialBuffer = Buffer.from(initialZip);

  const result = await optimizeZip(initialBuffer, { method: 'extreme' });

  assert.ok(Buffer.isBuffer(result.buffer));
  assert.strictEqual(result.outMime, 'application/zip');
  assert.strictEqual(result.stats.filesTotal, 4);
  assert.ok(result.stats.filesOptimized >= 2);
  assert.ok(result.stats.optimizedArchiveSize <= result.stats.originalArchiveSize);

  // Decompress to verify all files are intact and functional
  const extracted = fflate.unzipSync(new Uint8Array(result.buffer));
  assert.ok(extracted['index.html']);
  assert.ok(extracted['styles.css']);
  assert.ok(extracted['app.js']);
  assert.ok(extracted['data.json']);

  const htmlContent = fflate.strFromU8(extracted['index.html']);
  assert.ok(htmlContent.includes('Hello World'));
});
