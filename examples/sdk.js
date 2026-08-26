/**
 * Example: Using Condense v1.0.0 as a Programmatic SDK
 * Demonstrates fluent pipelines, perceptual image compression, SVG sprites, and format optimizers
 */

const {
  createPipeline,
  optimizePerceptualImage,
  packSvgSprites,
  optimizeZip,
  optimizeFont,
  optimizeText,
  optimizeImage,
  telemetryService,
} = require('../src/index');

async function exampleFluentPipeline() {
  console.log('⚡ 1. Fluent Pipeline Example');

  const sampleHtml = '<html><body>  <h1>  Hello Condense v1.0  </h1>  </body></html>';
  const pipeline = createPipeline(sampleHtml, 'text/html');

  const result = await pipeline.minify().toBuffer();
  console.log(`  Minified HTML: ${result.toString()}`);
}

async function examplePerceptualOptimization() {
  console.log('\n👁️ 2. Perceptual SSIM Image Optimization');

  // 1x1 dummy PNG buffer for demonstration
  const png1x1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  const result = await optimizePerceptualImage(png1x1, 'image/png', {
    targetSsim: 0.95,
    format: 'webp',
  });

  console.log(`  Target SSIM: 0.95 | Achieved SSIM: ${result.ssim} | Quality: ${result.finalQuality}`);
}

async function exampleSvgSpritesheet() {
  console.log('\n🎨 3. SVG Spritesheet Packing');

  const svgs = [
    { id: 'icon-home', content: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>' },
    { id: 'icon-user', content: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/></svg>' },
  ];

  const sheet = packSvgSprites(svgs);
  console.log(`  Generated Spritesheet: ${sheet.substring(0, 70)}...`);
}

async function exampleTelemetry() {
  console.log('\n📊 4. Telemetry and ROI Metrics');

  telemetryService.record('image/jpeg', 1024 * 1024, 256 * 1024);
  const metrics = telemetryService.getMetrics();

  console.log(`  Total Files Processed: ${metrics.totalFiles}`);
  console.log(`  Total Bandwidth Saved: ${metrics.totalSavedBytesFormatted}`);
  console.log(`  Est. Cost Savings: $${metrics.estimatedCostSavingsUsd}`);
  console.log(`  Est. Carbon Reduction: ${metrics.estimatedCarbonReductionGrams} gCO2`);
}

async function main() {
  console.log('--- Condense v1.0.0 SDK Showcase ---\n');
  await exampleFluentPipeline();
  await examplePerceptualOptimization();
  await exampleSvgSpritesheet();
  await exampleTelemetry();
  console.log('\n✅ SDK Examples finished successfully.');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  exampleFluentPipeline,
  examplePerceptualOptimization,
  exampleSvgSpritesheet,
  exampleTelemetry,
};

