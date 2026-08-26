'use strict';

const { Transform } = require('stream');
const path = require('path');
const { optimizeImage, optimizePerceptualImage } = require('./imageService');
const { optimizeText } = require('./textService');
const { optimizeEsbuild } = require('./esbuildService');
const { optimizeWasm } = require('./wasmService');
const { optimizeZip } = require('./archiveService');
const { optimizeFont } = require('./fontService');
const { optimizePdf } = require('./pdfService');
const { getPreset } = require('./presetService');
const telemetry = require('./telemetryService');

const EXT_TO_MIME = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.yaml': 'text/yaml',
  '.yml': 'text/yaml',
  '.less': 'text/less',
  '.scss': 'text/x-scss',
  '.graphql': 'application/graphql',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.wasm': 'application/wasm',
  '.zip': 'application/zip',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

const ESBUILD_EXTS = new Set(['.ts', '.jsx', '.tsx']);

class CondensePipeline {
  constructor(options = {}) {
    this._method = options.method || 'quality';
    this._options = { ...options };
    this._transforms = [];
    this._presetName = null;
  }

  preset(name, overrides = {}) {
    this._presetName = name;
    const preset = getPreset(name);
    if (preset) {
      this._method = overrides.method || preset.method || this._method;
      this._options = { ...preset.options, ...overrides };
    }
    return this;
  }

  method(mode) {
    this._method = mode;
    return this;
  }

  resize(resizeOptions) {
    this._options = { ...this._options, ...resizeOptions };
    return this;
  }

  convert(targetFormat) {
    this._options.targetFormat = targetFormat;
    return this;
  }

  perceptual(perceptualOptions = {}) {
    this._options.perceptual = true;
    this._options.targetSSIM = perceptualOptions.targetSSIM || 0.96;
    return this;
  }

  image(imgOptions = {}) {
    this._options = { ...this._options, ...imgOptions };
    return this;
  }

  text(textOptions = {}) {
    this._options = { ...this._options, ...textOptions };
    return this;
  }

  wasm(wasmOptions = {}) {
    this._options = { ...this._options, ...wasmOptions };
    return this;
  }

  archive(archiveOptions = {}) {
    this._options = { ...this._options, ...archiveOptions };
    return this;
  }

  /**
   * Processes an in-memory buffer through the pipeline.
   *
   * @param {Buffer|Uint8Array} inputBuffer
   * @param {string} [mimeOrPath] - MIME type or file path with extension
   * @returns {Promise<{ buffer: Buffer, outMime: string, stats: Object }>}
   */
  async process(inputBuffer, mimeOrPath = '') {
    const startTime = Date.now();
    const buffer = Buffer.isBuffer(inputBuffer) ? inputBuffer : Buffer.from(inputBuffer);
    const origSize = buffer.length;

    const mimeType = mimeOrPath.includes('/') ? mimeOrPath : (EXT_TO_MIME[path.extname(mimeOrPath).toLowerCase()] || 'application/octet-stream');
    const ext = path.extname(mimeOrPath).toLowerCase();

    let resultBuffer = buffer;
    let outMime = mimeType;
    let category = 'text';

    if (this._options.perceptual && mimeType.startsWith('image/') && mimeType !== 'image/svg+xml') {
      category = 'image';
      const res = await optimizePerceptualImage(buffer, mimeType, this._options);
      resultBuffer = res.buffer;
      outMime = res.outMime;
    } else if (mimeType.startsWith('image/') && mimeType !== 'image/svg+xml') {
      category = 'image';
      const res = await optimizeImage(buffer, mimeType, this._method, this._options);
      resultBuffer = res.buffer;
      outMime = res.outMime;
    } else if (ESBUILD_EXTS.has(ext)) {
      category = 'esbuild';
      const res = await optimizeEsbuild(buffer, ext, this._method);
      resultBuffer = res.buffer;
      outMime = res.outMime;
    } else if (mimeType === 'application/wasm' || ext === '.wasm') {
      category = 'wasm';
      const res = optimizeWasm(buffer, this._method);
      resultBuffer = res.buffer;
      outMime = res.outMime;
    } else if (mimeType === 'application/zip' || ext === '.zip') {
      category = 'archive';
      const res = await optimizeZip(buffer, { method: this._method, ...this._options });
      resultBuffer = res.buffer;
      outMime = res.outMime;
    } else if (mimeType.startsWith('font/') || ext === '.ttf' || ext === '.otf') {
      category = 'font';
      const res = optimizeFont(buffer, { method: this._method, ...this._options });
      resultBuffer = res.buffer;
      outMime = res.outMime;
    } else if (mimeType === 'application/pdf' || ext === '.pdf') {
      category = 'pdf';
      const res = optimizePdf(buffer, { method: this._method, ...this._options });
      resultBuffer = res.buffer;
      outMime = res.outMime;
    } else {
      category = 'text';
      const res = await optimizeText(buffer, mimeType, this._method);
      resultBuffer = res.buffer;
      outMime = res.outMime;
    }

    const durationMs = Date.now() - startTime;
    telemetry.record(category, origSize, resultBuffer.length, durationMs);

    const savingsPercent = origSize > 0
      ? Number((((origSize - resultBuffer.length) / origSize) * 100).toFixed(1))
      : 0;

    return {
      buffer: resultBuffer,
      outMime,
      stats: {
        originalSize: origSize,
        optimizedSize: resultBuffer.length,
        savingsPercent,
        durationMs,
        category,
        method: this._method,
        preset: this._presetName,
      },
    };
  }

  /**
   * Returns a standard Node.js Transform stream for streaming data through the pipeline.
   *
   * @param {string} [mimeOrExt]
   * @returns {Transform}
   */
  stream(mimeOrExt = 'application/octet-stream') {
    const chunks = [];
    const pipeline = this;

    return new Transform({
      transform(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
      async flush(callback) {
        try {
          const inputBuffer = Buffer.concat(chunks);
          const result = await pipeline.process(inputBuffer, mimeOrExt);
          this.push(result.buffer);
          callback();
        } catch (err) {
          callback(err);
        }
      },
    });
  }
}

function createPipeline(options = {}) {
  return new CondensePipeline(options);
}

module.exports = {
  CondensePipeline,
  createPipeline,
};
