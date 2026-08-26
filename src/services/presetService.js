'use strict';

/**
 * Built-in Preset and Recipe System for Condense.
 */

const BUILTIN_PRESETS = {
  'web-hero': {
    description: 'High-impact responsive hero banner optimized for web delivery',
    category: 'image',
    method: 'balanced',
    options: {
      width: 1920,
      fit: 'inside',
      targetFormat: 'webp',
      keepMetadata: false,
    },
  },
  avatar: {
    description: 'Square user avatar cropped to facial / attention focus',
    category: 'image',
    method: 'extreme',
    options: {
      width: 256,
      height: 256,
      fit: 'cover',
      cropStrategy: 'attention',
      targetFormat: 'webp',
    },
  },
  thumbnail: {
    description: 'Standard 16:9 card / video preview thumbnail',
    category: 'image',
    method: 'balanced',
    options: {
      width: 320,
      height: 180,
      fit: 'cover',
      targetFormat: 'webp',
    },
  },
  'podcast-audio': {
    description: 'EBU R128 loudness normalized audio with high speech clarity',
    category: 'media',
    method: 'balanced',
    options: {
      normalizeAudio: true,
      loudnorm: true,
    },
  },
  'production-bundle': {
    description: 'Maximum code compression for production JS/CSS/HTML web builds',
    category: 'text',
    method: 'extreme',
    options: {
      mangleTokens: true,
      dropConsole: true,
    },
  },
  'email-safe': {
    description: 'HTML and CSS minification preserving email client quirks and markup',
    category: 'text',
    method: 'quality',
    options: {
      keepMetadata: true,
    },
  },
  'lossless-archive': {
    description: 'Visually lossless recursive ZIP archive optimization',
    category: 'archive',
    method: 'quality',
    options: {
      keepFormat: true,
    },
  },
  'wasm-micro': {
    description: 'Extreme custom section and debug stripping for minimal edge WASM binary',
    category: 'wasm',
    method: 'extreme',
    options: {},
  },
};

const customPresets = new Map();

/**
 * Registers a new user-defined preset.
 *
 * @param {string} name - Unique preset identifier
 * @param {Object} config - Preset configuration
 */
function registerPreset(name, config) {
  if (!name || typeof name !== 'string') {
    throw new Error('Preset name must be a non-empty string');
  }
  if (!config || typeof config !== 'object') {
    throw new Error('Preset config must be an object');
  }
  customPresets.set(name.toLowerCase(), config);
}

/**
 * Retrieves a preset by name (checking custom presets first, then built-in presets).
 *
 * @param {string} name - Preset name
 * @returns {Object|null}
 */
function getPreset(name) {
  if (!name) return null;
  const key = String(name).toLowerCase();
  if (customPresets.has(key)) {
    return customPresets.get(key);
  }
  if (BUILTIN_PRESETS[key]) {
    return BUILTIN_PRESETS[key];
  }
  return null;
}

/**
 * Lists all available presets (both built-in and custom).
 *
 * @returns {Object}
 */
function listPresets() {
  const all = {};
  for (const [k, v] of Object.entries(BUILTIN_PRESETS)) {
    all[k] = { ...v, builtIn: true };
  }
  for (const [k, v] of customPresets.entries()) {
    all[k] = { ...v, builtIn: false };
  }
  return all;
}

/**
 * Resolves user options merged on top of a preset.
 */
function resolveOptionsWithPreset(presetNameOrOptions, overrides = {}) {
  if (typeof presetNameOrOptions === 'string') {
    const preset = getPreset(presetNameOrOptions);
    if (preset) {
      return {
        method: overrides.method || preset.method,
        ...preset.options,
        ...overrides,
      };
    }
  }
  return { ...presetNameOrOptions, ...overrides };
}

module.exports = {
  BUILTIN_PRESETS,
  registerPreset,
  getPreset,
  listPresets,
  resolveOptionsWithPreset,
};
