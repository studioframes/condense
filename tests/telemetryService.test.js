'use strict';

const test = require('node:test');
const assert = require('node:assert');
const telemetry = require('../src/services/telemetryService');

test('telemetryService - records events and calculates ROI metrics', () => {
  telemetry.reset();

  telemetry.record('image', 1000000, 300000, 50); // 700KB saved
  telemetry.record('text', 500000, 200000, 20); // 300KB saved

  const metrics = telemetry.getMetrics();

  assert.strictEqual(metrics.totalRequests, 2);
  assert.strictEqual(metrics.totalBytesIn, 1500000);
  assert.strictEqual(metrics.totalBytesOut, 500000);
  assert.strictEqual(metrics.totalBytesSaved, 1000000);
  assert.strictEqual(metrics.overallReductionPercent, 66.7);

  assert.ok(metrics.roi.estimatedBandwidthSavedGB > 0);
  assert.ok(metrics.roi.estimatedCostSavingsUSD >= 0);
  assert.ok(metrics.roi.estimatedCo2SavedGrams >= 0);

  assert.strictEqual(metrics.categories.image.filesProcessed, 1);
  assert.strictEqual(metrics.categories.text.filesProcessed, 1);
});
