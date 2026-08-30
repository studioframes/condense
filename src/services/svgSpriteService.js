'use strict';

const { optimize: optimizeSvg } = require('svgo');

/**
 * Parses viewBox or width/height attributes from an SVG string
 */
function extractViewBox(svgString) {
  const viewBoxMatch = svgString.match(/viewBox=["']([^"']+)["']/i);
  if (viewBoxMatch) {
    return viewBoxMatch[1];
  }

  const widthMatch = svgString.match(/width=["'](\d+(?:\.\d+)?)(?:px)?["']/i);
  const heightMatch = svgString.match(/height=["'](\d+(?:\.\d+)?)(?:px)?["']/i);

  if (widthMatch && heightMatch) {
    return `0 0 ${widthMatch[1]} ${heightMatch[1]}`;
  }

  return '0 0 24 24'; // Default fallback viewBox
}

/**
 * Extracts the inner XML content from an SVG string (between <svg...> and </svg>)
 */
function extractInnerSvg(svgString) {
  let cleaned = svgString;
  let previous;

  do {
    previous = cleaned;
    cleaned = cleaned
      .replace(/<\?xml[^>]*\?>/gi, '')
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '');
  } while (cleaned !== previous);

  const startMatch = cleaned.match(/<svg[^>]*>/i);
  if (!startMatch) return '';

  const startIndex = startMatch.index + startMatch[0].length;
  const endIndex = cleaned.lastIndexOf('</svg>');

  if (endIndex === -1 || endIndex <= startIndex) return '';

  return cleaned.substring(startIndex, endIndex).trim();
}

/**
 * In-memory SVG spritesheet packer.
 * Packs multiple SVG files into a single optimized SVG <defs><symbol> sprite.
 *
 * @param {Array<{ id: string, svg: string|Buffer }>|Object<string, string|Buffer>} items - SVGs to pack
 * @param {Object} options - { method: 'quality'|'balanced'|'extreme', prefix: string }
 * @returns {Promise<{ buffer: Buffer, outMime: string, symbolIds: string[], stats: Object }>}
 */
async function packSvgSprites(items, options = {}) {
  const method = options.method || 'balanced';
  const prefix = options.prefix || 'icon-';

  // Normalize input into an array of { id, content }
  const normalizedList = [];
  if (Array.isArray(items)) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const id = item.id || `${prefix}${i + 1}`;
      const content = Buffer.isBuffer(item.svg) ? item.svg.toString('utf8') : String(item.svg || item.content || '');
      normalizedList.push({ id, content, origLen: Buffer.byteLength(content) });
    }
  } else if (items && typeof items === 'object') {
    for (const [key, val] of Object.entries(items)) {
      const id = key.startsWith(prefix) ? key : `${prefix}${key}`;
      const content = Buffer.isBuffer(val) ? val.toString('utf8') : String(val);
      normalizedList.push({ id, content, origLen: Buffer.byteLength(content) });
    }
  }

  if (normalizedList.length === 0) {
    throw new Error('No SVG items provided for spritesheet packing');
  }

  let totalOriginalSize = 0;
  const symbols = [];
  const symbolIds = [];

  for (const item of normalizedList) {
    totalOriginalSize += item.origLen;

    // Optimize individual SVG first
    const optimized = optimizeSvg(item.content, {
      multipass: method === 'extreme' || method === 'balanced',
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupIds: false,
            },
          },
        },
      ],
    });
    const optimizedSvg = optimized.data;

    const viewBox = extractViewBox(optimizedSvg);
    const innerContent = extractInnerSvg(optimizedSvg);

    // Sanitize symbol id (alphanumeric and hyphens only)
    const cleanId = item.id.replace(/[^a-zA-Z0-9-_]/g, '-');
    symbolIds.push(cleanId);

    symbols.push(`<symbol id="${cleanId}" viewBox="${viewBox}">${innerContent}</symbol>`);
  }

  // Construct complete spritesheet
  const spritesheetSvg = [
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">',
    '<defs>',
    symbols.join('\n'),
    '</defs>',
    '</svg>',
  ].join('\n');

  // Final pass minification without stripping symbols or IDs
  const finalOptimized = optimizeSvg(spritesheetSvg, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupIds: false,
            collapseGroups: false,
            removeUselessDefs: false,
            removeHiddenElems: false,
          },
        },
      },
    ],
    js2svg: {
      indent: method === 'quality' ? 2 : 0,
      pretty: method === 'quality',
    },
  });

  const outBuffer = Buffer.from(finalOptimized.data, 'utf8');
  const packedSize = outBuffer.length;
  const savings = totalOriginalSize > 0 ? Number((((totalOriginalSize - packedSize) / totalOriginalSize) * 100).toFixed(1)) : 0;

  return {
    buffer: outBuffer,
    outMime: 'image/svg+xml',
    symbolIds,
    stats: {
      count: normalizedList.length,
      originalSize: totalOriginalSize,
      packedSize,
      savings,
    },
  };
}

module.exports = {
  packSvgSprites,
};
