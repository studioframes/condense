'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { packSvgSprites } = require('../src/services/svgSpriteService');

const SVG_1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>';
const SVG_2 = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="10" fill="red"/></svg>';

test('svgSpriteService - packs array of SVGs into symbol spritesheet', async () => {
  const result = await packSvgSprites([
    { id: 'icon-home', svg: SVG_1 },
    { id: 'icon-circle', svg: SVG_2 },
  ]);

  assert.ok(Buffer.isBuffer(result.buffer));
  assert.strictEqual(result.outMime, 'image/svg+xml');
  assert.deepStrictEqual(result.symbolIds, ['icon-home', 'icon-circle']);
  assert.strictEqual(result.stats.count, 2);

  const xml = result.buffer.toString('utf8');
  assert.ok(xml.includes('<symbol id="icon-home"'));
  assert.ok(xml.includes('<symbol id="icon-circle"'));
  assert.ok(xml.includes('viewBox="0 0 24 24"'));
  assert.ok(xml.includes('viewBox="0 0 32 32"'));
});

test('svgSpriteService - packs object map of SVGs', async () => {
  const result = await packSvgSprites({
    home: SVG_1,
    circle: SVG_2,
  });

  assert.strictEqual(result.symbolIds.length, 2);
  assert.ok(result.symbolIds.includes('icon-home'));
  assert.ok(result.symbolIds.includes('icon-circle'));
  assert.strictEqual(typeof result.stats.savings, 'number');
});
