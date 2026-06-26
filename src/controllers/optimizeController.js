const path = require('path');
const { optimizeText } = require('../services/textService');
const { optimizeImage } = require('../services/imageService');
const { optimizeMediaStream, extractVideoThumbnail } = require('../services/mediaService');
const { optimizeEsbuild } = require('../services/esbuildService');
const { optimizeWasm } = require('../services/wasmService');
const cacheService = require('../services/cacheService');

const TEXT_MIMES = [
  'application/javascript', 'text/javascript', 'text/css', 'application/json',
  'text/html', 'image/svg+xml', 'application/xml', 'text/xml', 'text/yaml',
  'application/x-yaml', 'text/less', 'text/x-scss', 'application/graphql'
];
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MEDIA_MIMES = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'video/mp4'];
const ESBUILD_MIMES = ['application/typescript', 'text/typescript', 'text/jsx', 'text/tsx'];
const WASM_MIMES = ['application/wasm'];

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
};

async function optimizeFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded in the "file" field.' });
    }

    let method = 'quality';
    if (req.body.method === 'extreme') method = 'extreme';
    if (req.body.method === 'balanced') method = 'balanced';

    let mimeType = req.file.mimetype;
    const fileBuffer = req.file.buffer;
    const originalExt = path.extname(req.file.originalname || '').toLowerCase();

    // Fallback for generic mime types
    if (mimeType === 'application/octet-stream' || !mimeType) {
      if (EXT_TO_MIME[originalExt]) {
        mimeType = EXT_TO_MIME[originalExt];
      }
    }
    
    // For esbuild we specifically need the extension
    let esbuildExt = null;
    if (originalExt === '.ts' || originalExt === '.jsx' || originalExt === '.tsx') {
        esbuildExt = originalExt;
    } else if (ESBUILD_MIMES.includes(mimeType)) {
        if (mimeType.includes('typescript')) esbuildExt = '.ts';
        if (mimeType.includes('jsx')) esbuildExt = '.jsx';
        if (mimeType.includes('tsx')) esbuildExt = '.tsx';
    }

    // Parse Resizing & Options (allow both query parameters and body)
    const width = req.query.width || req.body.width;
    const height = req.query.height || req.body.height;
    const fit = req.query.fit || req.body.fit;
    const faststart = req.query.faststart === 'true' || req.body.faststart === 'true';
    const thumbnail = req.query.thumbnail === 'true' || req.body.thumbnail === 'true';
    const keepMetadata = req.query.keepMetadata === 'true' || req.body.keepMetadata === 'true';
    const keepFormat = req.query.keepFormat === 'true' || req.body.keepFormat === 'true';
    let targetFormat = req.query.targetFormat || req.body.targetFormat;

    // Content negotiation for images in extreme mode
    if (!targetFormat && req.accepts('image/avif')) {
      targetFormat = 'avif';
    }

    const options = { width, height, fit, keepMetadata, keepFormat, targetFormat, faststart };

    // Extract Video Thumbnail
    if (thumbnail && mimeType.startsWith('video/')) {
      const { buffer, outMime } = await extractVideoThumbnail(fileBuffer);
      res.setHeader('Content-Type', outMime);
      res.setHeader('Content-Length', buffer.length);
      return res.send(buffer);
    }

    // Check Cache (only for non-streaming formats)
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

    // 1. TEXT / CODE
    if (TEXT_MIMES.includes(mimeType)) {
      const { buffer, outMime } = await optimizeText(fileBuffer, mimeType, method);
      resultBuffer = buffer;
      resultMime = outMime;
    }
    // 2. ESBUILD (TS/JSX/TSX)
    else if (ESBUILD_MIMES.includes(mimeType) || esbuildExt) {
      if (!esbuildExt) {
        return res.status(400).json({ error: 'Could not determine exact extension for esbuild.' });
      }
      const { buffer, outMime } = await optimizeEsbuild(fileBuffer, esbuildExt, method);
      resultBuffer = buffer;
      resultMime = outMime;
    }
    // 3. WASM
    else if (WASM_MIMES.includes(mimeType) || originalExt === '.wasm') {
      const { buffer, outMime } = await optimizeWasm(fileBuffer, method);
      resultBuffer = buffer;
      resultMime = outMime;
    }
    // 4. IMAGES
    else if (IMAGE_MIMES.includes(mimeType)) {
      const { buffer, outMime } = await optimizeImage(fileBuffer, mimeType, method, options);
      resultBuffer = buffer;
      resultMime = outMime;
    }
    // 5. AUDIO / VIDEO (Handles Stream Piping)
    else if (MEDIA_MIMES.includes(mimeType)) {
      const { stream, outMime } = optimizeMediaStream(fileBuffer, mimeType, method, options);
      res.setHeader('Content-Type', outMime);
      res.setHeader('Transfer-Encoding', 'chunked'); // Required for streaming processed video

      stream.on('error', (err) => {
        if (!res.headersSent) {
          next(err);
        } else {
          res.end(); // If it errors mid-stream, safely terminate the HTTP connection
        }
      });

      // Pipe output stream identically into response stream instantly
      return stream.pipe(res);
    }
    // 6. FALLBACK
    else {
      return res.status(400).json({
        error: 'Unsupported file type. Supported: JS, CSS, JSON, HTML, SVG, XML, YAML, GraphQL, TS, JSX, TSX, WASM, JPG, PNG, WebP, AVIF, GIF, MP3, WAV, MP4.',
      });
    }

    if (resultBuffer && resultMime) {
      if (cacheKey && cacheService.isEnabled()) {
        cacheService.setCached(cacheKey, { buffer: resultBuffer, outMime: resultMime });
      }
      res.setHeader('Content-Type', resultMime);
      res.setHeader('Content-Length', resultBuffer.length);
      return res.send(resultBuffer);
    }

  } catch (error) {
    next(error);
  }
}

module.exports = { optimizeFile };