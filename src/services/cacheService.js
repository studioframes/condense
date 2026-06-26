'use strict';

const { LRUCache } = require('lru-cache');
const crypto = require('crypto');

const cache = new LRUCache({
  max: parseInt(process.env.CONDENSE_CACHE_MAX_ENTRIES, 10) || 500,
  maxSize: parseInt(process.env.CONDENSE_CACHE_MAX_SIZE, 10) || 50 * 1024 * 1024,
  sizeCalculation: (value) => value.buffer.length,
});

function isEnabled() {
  return process.env.CONDENSE_CACHE === 'true';
}

function createCacheKey(buffer, mimeType, method, options) {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  hash.update(mimeType);
  hash.update(method);
  hash.update(JSON.stringify(options || {}));
  return hash.digest('hex');
}

function getCached(key) {
  if (!isEnabled()) {
    return undefined;
  }
  return cache.get(key);
}

function setCached(key, result) {
  if (!isEnabled()) {
    return;
  }
  if (result && result.buffer) {
    cache.set(key, result);
  }
}

module.exports = { isEnabled, createCacheKey, getCached, setCached };
