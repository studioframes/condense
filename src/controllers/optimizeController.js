'use strict';

const path = require('path');
const { optimizeText } = require('../services/textService');
const {
  optimizeImage,
  optimizePerceptualImage,
  generateResponsiveMatrix,
  generatePictureHtml,
} = require('../services/imageService');
const { optimizeMediaStream, extractVideoThumbnail } = require('../services/mediaService');
const { optimizeEsbuild } = require('../services/esbuildService');
const { optimizeWasm } = require('../services/wasmService');
const { optimizeZip } = require('../services/archiveService');
const { optimizeFont } = require('../services/fontService');
const { optimizePdf } = require('../services/pdfService');
const { packSvgSprites } = require('../services/svgSpriteService');
const { mangleTokens } = require('../services/tokenManglingService');
const { getPreset, resolveOptionsWithPreset } = require('../services/presetService');
const cacheService = require('../services/cacheService');
const telemetry = require('../services/telemetryService');

const TEXT_MIMES = [
  'application/javascript',
  'text/javascript',
  'text/css',
  'application/json',
  'text/html',
  'image/svg+xml',
  'application/xml',
  'text/xml',
  'text/yaml',
  'application/x-yaml',
  'text/less',
  'text/x-scss',
  'application/graphql',
];
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MEDIA_MIMES = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'video/mp4'];
const ESBUILD_MIMES = ['application/typescript', 'text/typescript', 'text/jsx', 'text/tsx'];
const WASM_MIMES = ['application/wasm'];
const ARCHIVE_MIMES = ['application/zip', 'application/x-zip-compressed'];
const FONT_MIMES = ['font/ttf', 'font/otf', 'font/woff', 'font/woff2', 'application/font-woff', 'application/font-sfnt'];
const PDF_MIMES = ['application/pdf'];

const EXT_TO_MIME = {
  '.ts': 'application/typescript',
  '.jsx': 'text/jsx',
  '.tsx': 'text/tsx',
  '.wasm': 'application/wasm',
  '.xml': 'application/xml',
  '.yaml': 'text/yaml',
  '.yml': 'text/yaml',
  '.less': 'text/less',
  '.scss': 'text/x-scss',
  '.graphql': 'application/graphql',
  '.gql': 'application/graphql',
  '.zip': 'application/zip',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
};

async function optimizeFile(req, res, next) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded in the "file" field.' });
    }

    let mimeType = req.file.mimetype;
    const fileBuffer = req.file.buffer;
    const originalExt = path.extname(req.file.originalname || '').toLowerCase();

    // Fallback for generic mime types
    if (mimeType === 'application/octet-stream' || !mimeType) {
      if (EXT_TO_MIME[originalExt]) {
        mimeType = EXT_TO_MIME[originalExt];
      }
    }

    // Apply Presets if requested
    const presetName = req.query.preset || req.body.preset;
    let method = 'quality';
    if (req.body.method === 'extreme' || req.query.method === 'extreme') method = 'extreme';
    if (req.body.method === 'balanced' || req.query.method === 'balanced') method = 'balanced';

    let resolvedOptions = { method };
    if (presetName) {
      const preset = getPreset(presetName);
      if (preset) {
        resolvedOptions = resolveOptionsWithPreset(presetName, {
          method: req.query.method || req.body.method || preset.method,
          ...req.query,
          ...req.body,
        });
        method = resolvedOptions.method || method;
      }
    }

    // Parse options
    const width = req.query.width || req.body.width || resolvedOptions.width;
    const height = req.query.height || req.body.height || resolvedOptions.height;
    const fit = req.query.fit || req.body.fit || resolvedOptions.fit;
    const gravity = req.query.gravity || req.body.gravity || req.query.cropStrategy || req.body.cropStrategy || resolvedOptions.cropStrategy;
    const faststart = req.query.faststart === 'true' || req.body.faststart === 'true' || resolvedOptions.faststart;
    const thumbnail = req.query.thumbnail === 'true' || req.body.thumbnail === 'true';
    const keepMetadata = req.query.keepMetadata === 'true' || req.body.keepMetadata === 'true' || resolvedOptions.keepMetadata;
    const keepFormat = req.query.keepFormat === 'true' || req.body.keepFormat === 'true' || resolvedOptions.keepFormat;
    const perceptual = req.query.perceptual === 'true' || req.body.perceptual === 'true';
    const targetSSIM = parseFloat(req.query.targetSSIM || req.body.targetSSIM || '0.96');
    const responsive = req.query.responsive === 'true' || req.body.responsive === 'true';
    const normalizeAudio = req.query.normalizeAudio === 'true' || req.body.normalizeAudio === 'true' || resolvedOptions.normalizeAudio;
    let targetFormat = req.query.targetFormat || req.body.targetFormat || resolvedOptions.targetFormat;

    // Content negotiation for images in extreme mode
    if (!targetFormat && req.accepts('image/avif') && method === 'extreme') {
      targetFormat = 'avif';
    }

    const options = {
      width,
      height,
      fit,
      gravity,
      cropStrategy: gravity,
      keepMetadata,
      keepFormat,
      targetFormat,
      faststart,
      targetSSIM,
      normalizeAudio,
    };

    // Extract Video Thumbnail
    if (thumbnail && mimeType.startsWith('video/')) {
      const { buffer, outMime } = await extractVideoThumbnail(fileBuffer, options);
      telemetry.record('media', fileBuffer.length, buffer.length, Date.now() - startTime);
      res.setHeader('Content-Type', outMime);
      res.setHeader('Content-Length', buffer.length);
      return res.send(buffer);
    }

    // Responsive Matrix Generation
    if (responsive && IMAGE_MIMES.includes(mimeType)) {
      const widthsParam = req.query.widths || req.body.widths;
      const customWidths = widthsParam
        ? (Array.isArray(widthsParam) ? widthsParam : String(widthsParam).split(',').map((w) => parseInt(w.trim(), 10)))
        : undefined;

      const matrix = await generateResponsiveMatrix(fileBuffer, mimeType, {
        widths: customWidths,
        method,
        fit,
        cropStrategy: gravity,
      });

      const pictureHtml = generatePictureHtml(matrix, { alt: req.query.alt || req.body.alt });
      telemetry.record('image', fileBuffer.length, matrix.variants.reduce((acc, v) => acc + v.size, 0), Date.now() - startTime);

      return res.json({
        matrix: {
          original: matrix.original,
          variantCount: matrix.variants.length,
          variants: matrix.variants.map((v) => ({
            format: v.format,
            mimeType: v.mimeType,
            width: v.width,
            height: v.height,
            size: v.size,
            descriptor: v.descriptor,
            base64Data: `data:${v.mimeType};base64,${v.buffer.toString('base64')}`,
          })),
        },
        pictureHtml,
      });
    }

    // Check Cache (for non-streaming formats)
    let cacheKey = null;
    if (!MEDIA_MIMES.includes(mimeType)) {
      if (cacheService.isEnabled()) {
        cacheKey = cacheService.createCacheKey(fileBuffer, mimeType, method, options);
        const cached = cacheService.getCached(cacheKey);
        if (cached) {
          res.setHeader('X-Condense-Cache', 'HIT');
          res.setHeader('Content-Type', cached.outMime);
          res.setHeader('Content-Length', cached.buffer.length);
          return res.send(cached.buffer);
        }
      }
      res.setHeader('X-Condense-Cache', 'MISS');
    }

    let resultBuffer;
    let resultMime;
    let category = 'text';

    // 1. TEXT / CODE
    if (TEXT_MIMES.includes(mimeType)) {
      category = 'text';
      const { buffer, outMime } = await optimizeText(fileBuffer, mimeType, method);
      resultBuffer = buffer;
      resultMime = outMime;
    }
    // 2. ESBUILD (TS/JSX/TSX)
    else if (ESBUILD_MIMES.includes(mimeType) || ESBUILD_EXTS_CHECK(originalExt)) {
      category = 'esbuild';
      const esbuildExt = originalExt || (mimeType.includes('typescript') ? '.ts' : mimeType.includes('jsx') ? '.jsx' : '.tsx');
      const { buffer, outMime } = await optimizeEsbuild(fileBuffer, esbuildExt, method);
      resultBuffer = buffer;
      resultMime = outMime;
    }
    // 3. WASM
    else if (WASM_MIMES.includes(mimeType) || originalExt === '.wasm') {
      category = 'wasm';
      const { buffer, outMime } = optimizeWasm(fileBuffer, method);
      resultBuffer = buffer;
      resultMime = outMime;
    }
    // 4. ARCHIVE (ZIP)
    else if (ARCHIVE_MIMES.includes(mimeType) || originalExt === '.zip') {
      category = 'archive';
      const { buffer, outMime, stats } = await optimizeZip(fileBuffer, { method, ...options });
      resultBuffer = buffer;
      resultMime = outMime;
      res.setHeader('X-Condense-Archive-Savings', `${stats.savingsPercent}%`);
    }
    // 5. FONTS (TTF / OTF / WOFF / WOFF2)
    else if (FONT_MIMES.includes(mimeType) || originalExt === '.ttf' || originalExt === '.otf' || originalExt === '.woff' || originalExt === '.woff2') {
      category = 'font';
      const { buffer, outMime } = optimizeFont(fileBuffer, { method, ...options });
      resultBuffer = buffer;
      resultMime = outMime;
    }
    // 6. PDF
    else if (PDF_MIMES.includes(mimeType) || originalExt === '.pdf') {
      category = 'pdf';
      const { buffer, outMime } = optimizePdf(fileBuffer, { method, ...options });
      resultBuffer = buffer;
      resultMime = outMime;
    }
    // 7. IMAGES
    else if (IMAGE_MIMES.includes(mimeType)) {
      category = 'image';
      if (perceptual) {
        const { buffer, outMime, quality, ssim } = await optimizePerceptualImage(fileBuffer, mimeType, options);
        resultBuffer = buffer;
        resultMime = outMime;
        res.setHeader('X-Condense-SSIM', String(ssim));
        res.setHeader('X-Condense-Quality', String(quality));
      } else {
        const { buffer, outMime } = await optimizeImage(fileBuffer, mimeType, method, options);
        resultBuffer = buffer;
        resultMime = outMime;
      }
    }
    // 8. AUDIO / VIDEO (Streaming)
    else if (MEDIA_MIMES.includes(mimeType)) {
      category = 'media';
      const { stream, outMime } = optimizeMediaStream(fileBuffer, mimeType, method, options);
      res.setHeader('Content-Type', outMime);
      res.setHeader('Transfer-Encoding', 'chunked');

      telemetry.record('media', fileBuffer.length, fileBuffer.length, Date.now() - startTime);

      stream.on('error', (err) => {
        if (!res.headersSent) {
          next(err);
        } else {
          res.end();
        }
      });

      return stream.pipe(res);
    }
    // 9. FALLBACK
    else {
      return res.status(400).json({
        error:
          'Unsupported file type. Supported: JS, CSS, JSON, HTML, SVG, XML, YAML, GraphQL, TS, JSX, TSX, WASM, ZIP, TTF, OTF, PDF, JPG, PNG, WebP, AVIF, GIF, MP3, WAV, MP4.',
      });
    }

    if (resultBuffer && resultMime) {
      const durationMs = Date.now() - startTime;
      telemetry.record(category, fileBuffer.length, resultBuffer.length, durationMs);

      if (cacheKey && cacheService.isEnabled()) {
        cacheService.setCached(cacheKey, { buffer: resultBuffer, outMime: resultMime });
      }

      const reduction = fileBuffer.length > 0
        ? (((fileBuffer.length - resultBuffer.length) / fileBuffer.length) * 100).toFixed(1)
        : '0.0';

      res.setHeader('X-Condense-Original-Size', fileBuffer.length);
      res.setHeader('X-Condense-Optimized-Size', resultBuffer.length);
      res.setHeader('X-Condense-Reduction', `${reduction}%`);
      res.setHeader('Content-Type', resultMime);
      res.setHeader('Content-Length', resultBuffer.length);
      return res.send(resultBuffer);
    }
  } catch (error) {
    next(error);
  }
}

function ESBUILD_EXTS_CHECK(ext) {
  return ext === '.ts' || ext === '.jsx' || ext === '.tsx';
}

/**
 * Controller for Coordinated Token Mangling endpoint
 */
async function handleMangleTokens(req, res, next) {
  try {
    const { html, css, js, options } = req.body || {};
    if (!html && !css && !js) {
      return res.status(400).json({ error: 'Provide at least one of "html", "css", or "js" in the request body.' });
    }

    const result = mangleTokens({ html, css, js }, options);
    return res.json({
      html: result.html ? result.html.toString('utf8') : null,
      css: result.css ? result.css.toString('utf8') : null,
      js: result.js ? result.js.toString('utf8') : null,
      tokenMap: result.tokenMap,
      stats: result.stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for SVG Spritesheet packing endpoint
 */
async function handleSvgSprites(req, res, next) {
  try {
    const { items, options } = req.body || {};
    if (!items || (Array.isArray(items) && items.length === 0)) {
      return res.status(400).json({ error: 'Provide an array or map of SVG items in the "items" field.' });
    }

    const result = await packSvgSprites(items, options);
    res.setHeader('Content-Type', result.outMime);
    res.setHeader('X-Condense-Symbols', result.symbolIds.join(', '));
    return res.send(result.buffer);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  optimizeFile,
  handleMangleTokens,
  handleSvgSprites,
};
