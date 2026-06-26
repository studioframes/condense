const test = require('node:test');
const cacheService = require('../src/services/cacheService');
const assert = require('assert');

test('cacheService - handles caching properly when enabled', (_t) => {
  // Mock env
  process.env.CONDENSE_CACHE = 'true';
  const key = cacheService.createCacheKey(Buffer.from('test'), 'text/plain', 'quality', {});
  cacheService.setCached(key, { buffer: Buffer.from('opt'), outMime: 'text/plain' });
  const cached = cacheService.getCached(key);
  assert(cached, 'Should retrieve from cache when enabled');
  assert(cached.buffer.toString() === 'opt', 'Cache content should match');
  
  process.env.CONDENSE_CACHE = 'false';
});
