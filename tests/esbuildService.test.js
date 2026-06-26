const test = require('node:test');
const { optimizeEsbuild } = require('../src/services/esbuildService');
const assert = require('assert');

test('esbuildService - optimizeEsbuild with TS', async (_t) => {
  const tsCode = `
    const x: number = 10;
    console.log(x);
  `;
  const buffer = Buffer.from(tsCode);
  const result = await optimizeEsbuild(buffer, '.ts', 'quality');

  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'application/javascript', 'Should return JS mime');
  assert(result.buffer.toString().includes('console.log(10)'), 'Should compile TS');
});

test('esbuildService - optimizeEsbuild extreme removes console', async (_t) => {
  const tsCode = `
    const x = 10;
    console.log(x);
  `;
  const buffer = Buffer.from(tsCode);
  const result = await optimizeEsbuild(buffer, '.ts', 'extreme');

  assert(!result.buffer.toString().includes('console.log'), 'Extreme should drop console');
});
