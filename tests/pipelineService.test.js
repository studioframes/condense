'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { createPipeline, CondensePipeline } = require('../src/services/pipelineService');
const { createSolidImage } = require('./helpers');

test('pipelineService - fluent chainable pipeline processes images', async () => {
  const pngBuffer = await createSolidImage(64, 64, { r: 255, g: 0, b: 0 }, 'png');

  const pipeline = createPipeline()
    .preset('web-hero')
    .resize({ width: 32, height: 32 });

  const result = await pipeline.process(pngBuffer, 'image/png');

  assert.ok(Buffer.isBuffer(result.buffer));
  assert.ok(result.outMime);
  assert.strictEqual(result.stats.category, 'image');
  assert.ok(result.stats.durationMs >= 0);
});

test('pipelineService - fluent pipeline processes text', async () => {
  const jsBuffer = Buffer.from('function add(a, b) {\n  return a + b;\n}\nconsole.log(add(1, 2));', 'utf8');

  const pipeline = new CondensePipeline().method('extreme').text();
  const result = await pipeline.process(jsBuffer, 'application/javascript');

  assert.ok(Buffer.isBuffer(result.buffer));
  assert.ok(result.buffer.length < jsBuffer.length);
  assert.strictEqual(result.stats.category, 'text');
});
