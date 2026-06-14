const test = require('node:test');
const { optimizeImage } = require('../src/services/imageService');
const { assert, createTestImagePNG, createTestImageJPEG } = require('./helpers');

test('imageService - optimizeImage with PNG (quality)', async (t) => {
  const buffer = createTestImagePNG();
  const result = await optimizeImage(buffer, 'image/png', 'quality');
  
  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'image/png' || result.outMime === 'image/webp', 'Should return valid mime');
  assert(result.buffer.length > 0, 'Output buffer should not be empty');
});

test('imageService - optimizeImage with PNG (extreme)', async (t) => {
  const buffer = createTestImagePNG();
  const result = await optimizeImage(buffer, 'image/png', 'extreme');
  
  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'image/png', 'Extreme PNG should stay PNG');
});

test('imageService - optimizeImage with JPEG (quality)', async (t) => {
  const buffer = createTestImageJPEG();
  const result = await optimizeImage(buffer, 'image/jpeg', 'quality');
  
  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'image/jpeg', 'Should return JPEG');
});

test('imageService - optimizeImage with JPEG (extreme)', async (t) => {
  const buffer = createTestImageJPEG();
  const result = await optimizeImage(buffer, 'image/jpeg', 'extreme');
  
  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'image/webp', 'Extreme JPEG should convert to WebP');
});
