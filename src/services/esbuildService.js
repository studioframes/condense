'use strict';

const esbuild = require('esbuild');

const LOADER_MAP = {
  '.ts': 'ts',
  '.jsx': 'jsx',
  '.tsx': 'tsx',
};

const OUT_MIME = 'application/javascript';

async function optimizeEsbuild(buffer, ext, method) {
  try {
    const source = buffer.toString('utf-8');

    if (source.includes('/* condense-ignore */')) {
      return { buffer, outMime: OUT_MIME };
    }

    const loader = LOADER_MAP[ext];

    let options;
    switch (method) {
      case 'quality':
        options = {
          loader,
          target: 'es2020',
          minifyWhitespace: true,
          minifySyntax: true,
          minifyIdentifiers: false,
        };
        break;
      case 'balanced':
        options = {
          loader,
          target: 'es2020',
          minifyWhitespace: true,
          minifySyntax: true,
          minifyIdentifiers: true,
        };
        break;
      case 'extreme':
        options = {
          loader,
          target: 'es2020',
          minifyWhitespace: true,
          minifySyntax: true,
          minifyIdentifiers: true,
          drop: ['console', 'debugger'],
          treeShaking: true,
        };
        break;
      default:
        options = {
          loader,
          target: 'es2020',
          minifyWhitespace: true,
          minifySyntax: true,
          minifyIdentifiers: false,
        };
    }

    const result = await esbuild.transform(source, options);

    return {
      buffer: Buffer.from(result.code, 'utf-8'),
      outMime: OUT_MIME,
    };
  } catch (error) {
    throw new Error('Esbuild optimization failed: ' + error.message);
  }
}

module.exports = { optimizeEsbuild };
