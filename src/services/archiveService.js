'use strict';

const path = require('path');
const fflate = require('fflate');
const { optimizeImage } = require('./imageService');
const { optimizeText } = require('./textService');
const { optimizeEsbuild } = require('./esbuildService');
const { optimizeWasm } = require('./wasmService');

const EXT_TO_MIME = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.cjs': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.yaml': 'text/yaml',
  '.yml': 'text/yaml',
  '.less': 'text/less',
  '.scss': 'text/x-scss',
  '.graphql': 'application/graphql',
  '.gql': 'application/graphql',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.wasm': 'application/wasm',
};

const ESBUILD_EXTS = new Set(['.ts', '.jsx', '.tsx']);

/**
 * Optimizes an in-memory ZIP archive recursively without temporary disk I/O.
 *
 * @param {Buffer|Uint8Array} zipBuffer - Input ZIP archive buffer
 * @param {Object} options - { method: 'quality'|'balanced'|'extreme', ignorePatterns: string[] }
 * @returns {Promise<{ buffer: Buffer, outMime: string, stats: Object }>}
 */
async function optimizeZip(zipBuffer, options = {}) {
  const method = options.method || 'balanced';
  const uint8Input = zipBuffer instanceof Uint8Array ? zipBuffer : new Uint8Array(zipBuffer);

  // Decompress in-memory
  const unzipped = fflate.unzipSync(uint8Input);

  const fileNames = Object.keys(unzipped);
  const optimizedFiles = {};
  const details = [];

  const totalOriginalBytes = uint8Input.byteLength;
  let totalUncompressedOriginal = 0;
  let totalUncompressedOptimized = 0;
  let filesOptimizedCount = 0;

  for (const filePath of fileNames) {
    const fileBytes = unzipped[filePath];
    const origSize = fileBytes.byteLength;
    totalUncompressedOriginal += origSize;

    // Check if it's a directory entry (ends in / or 0 bytes with no ext)
    if (filePath.endsWith('/') || origSize === 0) {
      optimizedFiles[filePath] = fileBytes;
      continue;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = EXT_TO_MIME[ext];
    const fileBuffer = Buffer.from(fileBytes);

    let resultBuffer = fileBuffer;
    let wasProcessed = false;

    try {
      if (mime && mime.startsWith('image/') && mime !== 'image/svg+xml') {
        const res = await optimizeImage(fileBuffer, mime, method, { keepFormat: true });
        resultBuffer = res.buffer;
        wasProcessed = true;
      } else if (mime && (mime.startsWith('text/') || mime === 'application/javascript' || mime === 'application/json' || mime === 'image/svg+xml' || mime === 'application/xml' || mime === 'application/graphql')) {
        const res = await optimizeText(fileBuffer, mime, method);
        resultBuffer = res.buffer;
        wasProcessed = true;
      } else if (ESBUILD_EXTS.has(ext)) {
        const res = await optimizeEsbuild(fileBuffer, ext, method);
        resultBuffer = res.buffer;
        wasProcessed = true;
      } else if (ext === '.wasm' || mime === 'application/wasm') {
        const res = optimizeWasm(fileBuffer, method);
        resultBuffer = res.buffer;
        wasProcessed = true;
      }
    } catch {
      // If individual file optimization fails, gracefully retain original file
      resultBuffer = fileBuffer;
      wasProcessed = false;
    }

    // Only replace if optimized version is actually smaller or equal
    if (wasProcessed && resultBuffer.length < origSize) {
      optimizedFiles[filePath] = new Uint8Array(resultBuffer);
      filesOptimizedCount++;
      totalUncompressedOptimized += resultBuffer.length;
      details.push({
        path: filePath,
        originalSize: origSize,
        optimizedSize: resultBuffer.length,
        savedBytes: origSize - resultBuffer.length,
      });
    } else {
      optimizedFiles[filePath] = fileBytes;
      totalUncompressedOptimized += origSize;
      details.push({
        path: filePath,
        originalSize: origSize,
        optimizedSize: origSize,
        savedBytes: 0,
      });
    }
  }

  // Repack into ultra-compressed ZIP in memory
  const repackedZip = fflate.zipSync(optimizedFiles, {
    level: method === 'extreme' ? 9 : method === 'balanced' ? 7 : 6,
    mem: 12,
  });

  const outputBuffer = Buffer.from(repackedZip);
  const totalOptimizedBytes = outputBuffer.byteLength;
  const overallSavings = totalOriginalBytes > 0
    ? Number((((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1))
    : 0;

  return {
    buffer: outputBuffer,
    outMime: 'application/zip',
    stats: {
      filesTotal: fileNames.length,
      filesOptimized: filesOptimizedCount,
      originalArchiveSize: totalOriginalBytes,
      optimizedArchiveSize: totalOptimizedBytes,
      uncompressedOriginalSize: totalUncompressedOriginal,
      uncompressedOptimizedSize: totalUncompressedOptimized,
      savingsPercent: overallSavings,
      details,
    },
  };
}

module.exports = {
  optimizeZip,
};
