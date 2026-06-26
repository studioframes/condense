const app = require('./app');
const { optimizeText } = require('./services/textService');
const { optimizeImage } = require('./services/imageService');
const { optimizeMediaStream, extractVideoThumbnail } = require('./services/mediaService');
const { optimizeEsbuild } = require('./services/esbuildService');
const { optimizeWasm } = require('./services/wasmService');

module.exports = {
  // 1. As an Express sub-application/router
  condenseApp: app,

  // 2. Or as programmatic helper utilities
  optimizeText,
  optimizeImage,
  optimizeMediaStream,
  extractVideoThumbnail,
  optimizeEsbuild,
  optimizeWasm,
};