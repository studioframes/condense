'use strict';

/**
 * Generator for short unique sequential identifiers (a, b, ... z, aa, ab, ...)
 */
function createIdGenerator(reservedSet = new Set()) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let counter = 0;

  return function getNextId() {
    let name = '';
    let n = counter++;

    do {
      name = chars[n % chars.length] + name;
      n = Math.floor(n / chars.length) - 1;
    } while (n >= 0);

    if (reservedSet.has(name)) {
      return getNextId();
    }
    return name;
  };
}

/**
 * Coordinated Token Mangling across HTML, CSS, and JavaScript.
 * Minifies class names and element IDs in tandem across all three layers.
 *
 * @param {Object} bundle - { html?: string|Buffer, css?: string|Buffer, js?: string|Buffer }
 * @param {Object} options - { preservePatterns?: RegExp[], reservedTokens?: string[], prefix?: string }
 * @returns {Object} - { html, css, js, tokenMap, stats }
 */
function mangleTokens(bundle, options = {}) {
  const htmlStr = bundle.html ? (Buffer.isBuffer(bundle.html) ? bundle.html.toString('utf8') : String(bundle.html)) : '';
  const cssStr = bundle.css ? (Buffer.isBuffer(bundle.css) ? bundle.css.toString('utf8') : String(bundle.css)) : '';
  const jsStr = bundle.js ? (Buffer.isBuffer(bundle.js) ? bundle.js.toString('utf8') : String(bundle.js)) : '';

  const reserved = new Set([
    'data', 'type', 'id', 'class', 'style', 'body', 'html', 'head',
    'active', 'disabled', 'checked', 'selected', 'hidden', 'visible',
    ...(options.reservedTokens || []),
  ]);

  const nextClassId = createIdGenerator(reserved);
  const nextElementId = createIdGenerator(reserved);

  const classMap = new Map();
  const idMap = new Map();

  // 1. Scan CSS for class selectors (.class-name) and ID selectors (#element-id)
  if (cssStr) {
    const cssClassRegex = /\.([a-zA-Z0-9_-]+)/g;
    let match;
    while ((match = cssClassRegex.exec(cssStr)) !== null) {
      const cls = match[1];
      if (!classMap.has(cls) && !reserved.has(cls) && cls.length > 2) {
        classMap.set(cls, nextClassId());
      }
    }

    const cssIdRegex = /#([a-zA-Z0-9_-]+)/g;
    while ((match = cssIdRegex.exec(cssStr)) !== null) {
      const id = match[1];
      if (!idMap.has(id) && !reserved.has(id) && id.length > 2) {
        idMap.set(id, nextElementId());
      }
    }
  }

  // 2. Scan HTML for class="..." and id="..."
  if (htmlStr) {
    const htmlClassRegex = /class=["']([^"']+)["']/g;
    let match;
    while ((match = htmlClassRegex.exec(htmlStr)) !== null) {
      const classes = match[1].split(/\s+/);
      for (const cls of classes) {
        if (cls && !classMap.has(cls) && !reserved.has(cls) && cls.length > 2) {
          classMap.set(cls, nextClassId());
        }
      }
    }

    const htmlIdRegex = /id=["']([^"']+)["']/g;
    while ((match = htmlIdRegex.exec(htmlStr)) !== null) {
      const id = match[1].trim();
      if (id && !idMap.has(id) && !reserved.has(id) && id.length > 2) {
        idMap.set(id, nextElementId());
      }
    }
  }

  // 3. Transform CSS
  let transformedCss = cssStr;
  if (cssStr) {
    // Replace class selectors (.oldClass -> .newClass)
    for (const [oldClass, newClass] of classMap.entries()) {
      const escaped = oldClass.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      transformedCss = transformedCss.replace(new RegExp(`\\.${escaped}(?=[\\s,.:>~+[{()}-]|$)`, 'g'), `.${newClass}`);
    }
    // Replace ID selectors (#oldId -> #newId)
    for (const [oldId, newId] of idMap.entries()) {
      const escaped = oldId.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      transformedCss = transformedCss.replace(new RegExp(`#${escaped}(?=[\\s,.:>~+[{()}-]|$)`, 'g'), `#${newId}`);
    }
  }

  // 4. Transform HTML
  let transformedHtml = htmlStr;
  if (htmlStr) {
    transformedHtml = transformedHtml.replace(/class=["']([^"']+)["']/g, (match, classList) => {
      const updated = classList
        .split(/\s+/)
        .map((cls) => classMap.get(cls) || cls)
        .join(' ');
      return `class="${updated}"`;
    });

    transformedHtml = transformedHtml.replace(/id=["']([^"']+)["']/g, (match, idVal) => {
      const trimmed = idVal.trim();
      const updated = idMap.get(trimmed) || trimmed;
      return `id="${updated}"`;
    });
  }

  // 5. Transform JS (string occurrences matching class selectors and IDs)
  let transformedJs = jsStr;
  if (jsStr) {
    for (const [oldClass, newClass] of classMap.entries()) {
      const escaped = oldClass.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      transformedJs = transformedJs.replace(new RegExp(`(['"\`])\\.${escaped}\\1`, 'g'), `$1.${newClass}$1`);
      transformedJs = transformedJs.replace(new RegExp(`(['"\`])${escaped}\\1`, 'g'), `$1${newClass}$1`);
    }
    for (const [oldId, newId] of idMap.entries()) {
      const escaped = oldId.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      transformedJs = transformedJs.replace(new RegExp(`(['"\`])#${escaped}\\1`, 'g'), `$1#${newId}$1`);
    }
  }

  const origLen = Buffer.byteLength(htmlStr) + Buffer.byteLength(cssStr) + Buffer.byteLength(jsStr);
  const newLen = Buffer.byteLength(transformedHtml) + Buffer.byteLength(transformedCss) + Buffer.byteLength(transformedJs);
  const savingsPercent = origLen > 0 ? Number((((origLen - newLen) / origLen) * 100).toFixed(1)) : 0;

  return {
    html: transformedHtml ? Buffer.from(transformedHtml, 'utf8') : null,
    css: transformedCss ? Buffer.from(transformedCss, 'utf8') : null,
    js: transformedJs ? Buffer.from(transformedJs, 'utf8') : null,
    tokenMap: {
      classes: Object.fromEntries(classMap),
      ids: Object.fromEntries(idMap),
    },
    stats: {
      originalSize: origLen,
      mangledSize: newLen,
      savingsPercent,
      classesMangled: classMap.size,
      idsMangled: idMap.size,
    },
  };
}

module.exports = {
  mangleTokens,
};
