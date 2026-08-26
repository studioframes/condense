'use strict';

const test = require('node:test');
const assert = require('node:assert');
const {
  getPreset,
  listPresets,
  registerPreset,
  resolveOptionsWithPreset,
} = require('../src/services/presetService');

test('presetService - retrieves built-in presets', () => {
  const hero = getPreset('web-hero');
  assert.ok(hero);
  assert.strictEqual(hero.category, 'image');

  const avatar = getPreset('avatar');
  assert.ok(avatar);
  assert.strictEqual(avatar.options.cropStrategy, 'attention');

  const audio = getPreset('podcast-audio');
  assert.ok(audio);
  assert.strictEqual(audio.options.normalizeAudio, true);
});

test('presetService - registers custom preset', () => {
  registerPreset('custom-banner', {
    description: 'Custom wide banner',
    category: 'image',
    method: 'extreme',
    options: { width: 800, height: 200 },
  });

  const custom = getPreset('custom-banner');
  assert.ok(custom);
  assert.strictEqual(custom.options.width, 800);

  const presets = listPresets();
  assert.ok(presets['custom-banner']);
  assert.strictEqual(presets['custom-banner'].builtIn, false);
});

test('presetService - resolves options with preset overrides', () => {
  const resolved = resolveOptionsWithPreset('web-hero', { width: 1400 });
  assert.strictEqual(resolved.width, 1400);
  assert.strictEqual(resolved.targetFormat, 'webp');
});
