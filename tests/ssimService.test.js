'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { calculateSSIM, calculatePSNR, toLuminance } = require('../src/services/ssimService');

test('ssimService - calculates identical images as SSIM 1.0', () => {
  const width = 16;
  const height = 16;
  const raw = Buffer.alloc(width * height * 3, 128);

  const { ssim, mssim } = calculateSSIM(raw, raw, { width, height, channels: 3 });
  assert.strictEqual(ssim, 1.0);
  assert.strictEqual(mssim, 1.0);
});

test('ssimService - calculates PSNR on identical buffers as Infinity', () => {
  const raw = Buffer.alloc(100, 200);
  const { psnr, mse } = calculatePSNR(raw, raw);
  assert.strictEqual(psnr, Infinity);
  assert.strictEqual(mse, 0);
});

test('ssimService - detects degradation in noisy images', () => {
  const width = 16;
  const height = 16;
  const original = Buffer.alloc(width * height * 3, 150);
  const degraded = Buffer.alloc(width * height * 3, 150);

  // Add slight noise to degraded
  for (let i = 0; i < degraded.length; i += 6) {
    degraded[i] = 100;
  }

  const { ssim } = calculateSSIM(original, degraded, { width, height, channels: 3 });
  assert.ok(ssim < 1.0);
  assert.ok(ssim > 0.5);
});

test('ssimService - toLuminance converts RGB correctly', () => {
  const rgb = Buffer.from([255, 0, 0, 0, 255, 0, 0, 0, 255]); // Red, Green, Blue
  const luma = toLuminance(rgb, 3);
  assert.strictEqual(luma.length, 3);
  assert.ok(Math.abs(luma[0] - 76.245) < 0.1); // Red luma
  assert.ok(Math.abs(luma[1] - 149.685) < 0.1); // Green luma
  assert.ok(Math.abs(luma[2] - 29.07) < 0.1); // Blue luma
});
