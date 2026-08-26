'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { WorkerPool } = require('../src/services/workerPool');

test('workerPool - runs image optimization task', async () => {
  const pool = new WorkerPool(1);
  try {
    const { createTestImagePNG } = require('./helpers');
    const buffer = createTestImagePNG();

    const result = await pool.runTask({
      type: 'image',
      buffer,
      mimeType: 'image/png',
      method: 'quality',
      options: {},
    });

    assert.ok(Buffer.isBuffer(result.buffer));
    assert.strictEqual(result.outMime, 'image/png');
  } finally {
    pool.destroy();
  }
});

test('workerPool - runs text optimization task', async () => {
  const pool = new WorkerPool(1);
  try {
    const jsBuffer = Buffer.from('var x = 10; var y = 20; console.log(x + y);', 'utf8');

    const result = await pool.runTask({
      type: 'text',
      buffer: jsBuffer,
      mimeType: 'application/javascript',
      method: 'extreme',
    });

    assert.ok(Buffer.isBuffer(result.buffer));
    assert.strictEqual(result.outMime, 'application/javascript');
  } finally {
    pool.destroy();
  }
});
