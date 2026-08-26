'use strict';

const app = require('./app');
const { optimizeText } = require('./services/textService');
const {
  optimizeImage,
  optimizePerceptualImage,
  generateResponsiveMatrix,
  generatePictureHtml,
} = require('./services/imageService');
const { optimizeMediaStream, extractVideoThumbnail } = require('./services/mediaService');
const { optimizeEsbuild } = require('./services/esbuildService');
const { optimizeWasm } = require('./services/wasmService');
const { optimizeZip } = require('./services/archiveService');
const { optimizeFont } = require('./services/fontService');
const { optimizePdf } = require('./services/pdfService');
const { packSvgSprites } = require('./services/svgSpriteService');
const { mangleTokens } = require('./services/tokenManglingService');
const { calculateSSIM, calculatePSNR } = require('./services/ssimService');
const { createPipeline, CondensePipeline } = require('./services/pipelineService');
const {
  BUILTIN_PRESETS,
  registerPreset,
  getPreset,
  listPresets,
  resolveOptionsWithPreset,
} = require('./services/presetService');
const telemetry = require('./services/telemetryService');
const { WorkerPool, getWorkerPool } = require('./services/workerPool');

/**
 * Main callable condense function for creating fluent pipelines
 */
function condense(options = {}) {
  return createPipeline(options);
}

// Attach all public exports to condense function and module.exports
const exportsMap = {
  // 1. As an Express sub-application/router
  condenseApp: app,

  // 2. Programmatic Media & Image APIs
  optimizeImage,
  optimizePerceptualImage,
  generateResponsiveMatrix,
  generatePictureHtml,
  optimizeMediaStream,
  extractVideoThumbnail,
  packSvgSprites,

  // 3. Programmatic Text, Code, & Binary Compactor APIs
  optimizeText,
  optimizeEsbuild,
  optimizeWasm,
  optimizeZip,
  optimizeFont,
  optimizePdf,
  mangleTokens,

  // 4. Perceptual Quality Utilities
  calculateSSIM,
  calculatePSNR,

  // 5. Streaming & Pipeline Engine
  condense,
  createPipeline,
  CondensePipeline,

  // 6. Preset Registry
  presets: {
    BUILTIN_PRESETS,
    registerPreset,
    getPreset,
    listPresets,
    resolveOptionsWithPreset,
  },
  registerPreset,
  getPreset,
  listPresets,

  // 7. Telemetry & ROI Engine
  telemetry,

  // 8. Multi-Threading Worker Pool
  WorkerPool,
  getWorkerPool,
};

Object.assign(condense, exportsMap);

module.exports = condense;
