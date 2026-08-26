const test = require('node:test');
const {
  optimizeImage,
  optimizePerceptualImage,
  generateResponsiveMatrix,
  generatePictureHtml,
} = require('../src/services/imageService');
const {
  assert,
  createTestImagePNG,
  createTestImageJPEG,
  createSolidImage,
} = require('./helpers');

test('imageService - optimizeImage with PNG (quality)', async (_t) => {
  const buffer = createTestImagePNG();
  const result = await optimizeImage(buffer, 'image/png', 'quality');

  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(
    result.outMime === 'image/png' || result.outMime === 'image/webp',
    'Should return valid mime'
  );
  assert(result.buffer.length > 0, 'Output buffer should not be empty');
});

test('imageService - optimizeImage with PNG (extreme)', async (_t) => {
  const buffer = createTestImagePNG();
  const result = await optimizeImage(buffer, 'image/png', 'extreme');

  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'image/png', 'Extreme PNG should stay PNG');
});

test('imageService - optimizeImage with JPEG (quality)', async (_t) => {
  const buffer = createTestImageJPEG();
  const result = await optimizeImage(buffer, 'image/jpeg', 'quality');

  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'image/jpeg', 'Should return JPEG');
});

test('imageService - optimizeImage with JPEG (extreme)', async (_t) => {
  const buffer = createTestImageJPEG();
  const result = await optimizeImage(buffer, 'image/jpeg', 'extreme');

  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'image/webp', 'Extreme JPEG should convert to WebP');
});

test('imageService - optimizePerceptualImage searches for target SSIM', async (_t) => {
  const buffer = await createSolidImage(64, 64, { r: 100, g: 150, b: 200 }, 'jpeg');
  const result = await optimizePerceptualImage(buffer, 'image/jpeg', {
    targetSSIM: 0.95,
    targetFormat: 'webp',
  });

  assert(Buffer.isBuffer(result.buffer), 'Should return buffer');
  assert(result.outMime === 'image/webp', 'Should output target mime');
  assert(result.quality >= 20, 'Quality should be within bounds');
  assert(result.ssim >= 0.90, 'SSIM should meet or approximate target threshold');
});

test('imageService - generateResponsiveMatrix creates multi-breakpoint variants', async (_t) => {
  const buffer = await createSolidImage(400, 300, { r: 50, g: 100, b: 150 }, 'png');
  const result = await generateResponsiveMatrix(buffer, 'image/png', {
    widths: [100, 200, 300],
    formats: ['webp', 'jpeg'],
    method: 'balanced',
  });

  assert(result.original.width === 400);
  assert(result.variants.length === 6); // 3 widths x 2 formats

  const pictureHtml = generatePictureHtml(result, { alt: 'Responsive test banner' });
  assert(pictureHtml.includes('<picture'));
  assert(pictureHtml.includes('<source type="image/webp"'));
  assert(pictureHtml.includes('<source type="image/jpeg"'));
  assert(pictureHtml.includes('alt="Responsive test banner"'));
});
