const test = require('node:test');
const { optimizeWasm } = require('../src/services/wasmService');
const assert = require('assert');

test('wasmService - optimizeWasm handles invalid WASM', (_t) => {
  const invalidBuffer = Buffer.from('not wasm');
  assert.throws(() => {
    optimizeWasm(invalidBuffer, 'quality');
  }, /Invalid WebAssembly/);
});
