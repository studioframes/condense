const { minify: terserMinify } = require('terser');
const CleanCSS = require('clean-css');
const { minify: htmlMinify } = require('html-minifier-terser');
const { Parser } = require('htmlparser2');
const { optimize: optimizeSvg } = require('svgo');
const yaml = require('js-yaml');

function protectIgnoredTags(htmlString) {
  let output = '';
  let lastIndex = 0;
  let ignoreDepth = 0;

  const parser = new Parser({
    onopentag(_name, attributes) {
      const hasIgnore = attributes['data-condense-ignore'] !== undefined;

      // If we hit a new ignored tag and aren't already inside one
      if (ignoreDepth === 0 && hasIgnore) {
        output += htmlString.substring(lastIndex, parser.startIndex);
        output += '<!-- htmlmin:ignore -->'; // Inject opening marker
        lastIndex = parser.startIndex;
        ignoreDepth++;
      } else if (ignoreDepth > 0) {
        // If we are already inside an ignored block, just track nesting depth
        ignoreDepth++;
      }
    },
    onclosetag(_name) {
      // Drop depth as we exit tags.
      // (Note: htmlparser2 automatically triggers this instantly for void tags like <img>)
      if (ignoreDepth > 0) {
        ignoreDepth--;

        // If we just exited the root ignored tag
        if (ignoreDepth === 0) {
          const endOfTagIndex = parser.endIndex + 1;
          output += htmlString.substring(lastIndex, endOfTagIndex);
          output += '<!-- htmlmin:ignore -->'; // Inject closing marker
          lastIndex = endOfTagIndex;
        }
      }
    },
  }, { lowerCaseTags: false });

  // Execute the synchronous, memory-efficient string parse
  parser.write(htmlString);
  parser.end();

  // Catch trailing string, or gracefully close marker if user uploaded malformed HTML
  if (ignoreDepth > 0) {
    output += htmlString.substring(lastIndex) + '<!-- htmlmin:ignore -->';
  } else {
    output += htmlString.substring(lastIndex);
  }

  return output;
}

async function optimizeText(buffer, mimeType, method) {
  const input = buffer.toString('utf8');
  let output = input;
  const isExtreme = method === 'extreme';
  const isBalanced = method === 'balanced';

  try {
    // --- HTML ---
    if (mimeType === 'text/html') {
      // 1. Pre-process to protect elements with `data-condense-ignore`
      const protectedHtml = protectIgnoredTags(input);

      // 2. Configure Minifier
      let options;
      if (isExtreme) {
        options = {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
          removeAttributeQuotes: true,
          removeOptionalTags: true,
          collapseBooleanAttributes: true,
        };
      } else if (isBalanced) {
        options = {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
          collapseBooleanAttributes: true,
        };
      } else {
        options = {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
        };
      }

      // 3. Minify (The minifier natively skips everything between our markers)
      const minified = await htmlMinify(protectedHtml, options);

      // 4. Strip out the temporary markers before returning
      output = minified.replace(/<!-- htmlmin:ignore -->/g, '');
    } else if (mimeType === 'application/javascript' || mimeType === 'text/javascript') {
      // --- JavaScript ---
      if (input.includes('/* condense-ignore */')) {
        return { buffer, outMime: mimeType };
      }

      let options;
      if (isExtreme) {
        options = { compress: { passes: 2 }, mangle: { toplevel: true } };
      } else if (isBalanced) {
        options = { compress: { passes: 1, dead_code: true }, mangle: true };
      } else {
        options = { compress: true, mangle: true };
      }

      const result = await terserMinify(input, options);
      output = result.code;
    } else if (mimeType === 'text/css') {
      // --- CSS ---
      if (input.includes('/* condense-ignore */')) {
        return { buffer, outMime: mimeType };
      }

      let options;
      if (isExtreme) {
        options = { level: 2 };
      } else if (isBalanced) {
        options = { level: { 1: { all: true }, 2: { restructureRules: true } } };
      } else {
        options = { level: 1 };
      }
      const result = new CleanCSS(options).minify(input);
      output = result.styles;
    } else if (mimeType === 'application/json') {
      // --- JSON ---
      const parsed = JSON.parse(input);
      output = JSON.stringify(parsed);
    } else if (mimeType === 'image/svg+xml') {
      // --- SVG ---
      let svgOptions;
      if (isExtreme) {
        svgOptions = { multipass: true, js2svg: { indent: 0, pretty: false } };
      } else if (isBalanced) {
        svgOptions = { multipass: true, js2svg: { indent: 0, pretty: false } };
      } else {
        svgOptions = { multipass: false, js2svg: { indent: 2, pretty: true } };
      }
      const result = optimizeSvg(input, svgOptions);
      output = result.data;
    } else if (mimeType === 'application/xml' || mimeType === 'text/xml') {
      // --- XML ---
      // Strip XML comments safely (avoiding ReDoS and incomplete sanitization)
      let previous;
      do {
        previous = output;
        let temp = '';
        let i = 0;
        while (i < output.length) {
          const start = output.indexOf('<!--', i);
          if (start === -1) {
            temp += output.slice(i);
            break;
          }
          temp += output.slice(i, start);
          const end = output.indexOf('-->', start + 4);
          if (end === -1) {
            temp += output.slice(start);
            break;
          }
          i = end + 3;
        }
        output = temp;
      } while (output !== previous);
      // Collapse whitespace between tags
      output = output.replace(/>\s+</g, '><');
      if (isExtreme) {
        output = output.trim().replace(/\s+/g, ' ');
      }
    } else if (mimeType === 'text/yaml' || mimeType === 'application/x-yaml') {
      // --- YAML ---
      const parsed = yaml.load(input);
      if (isExtreme) {
        output = yaml.dump(parsed, { flowLevel: 0, lineWidth: -1 });
      } else {
        output = yaml.dump(parsed, { lineWidth: -1 });
      }
    } else if (mimeType === 'text/less') {
      // --- Less ---
      if (input.includes('/* condense-ignore */')) {
        return { buffer, outMime: mimeType };
      }

      let options;
      if (isExtreme) {
        options = { level: 2 };
      } else if (isBalanced) {
        options = { level: { 1: { all: true }, 2: { restructureRules: true } } };
      } else {
        options = { level: 1 };
      }
      const result = new CleanCSS(options).minify(input);
      output = result.styles;
    } else if (mimeType === 'text/x-scss') {
      // --- SCSS ---
      if (input.includes('/* condense-ignore */')) {
        return { buffer, outMime: mimeType };
      }

      let options;
      if (isExtreme) {
        options = { level: 2 };
      } else if (isBalanced) {
        options = { level: { 1: { all: true }, 2: { restructureRules: true } } };
      } else {
        options = { level: 1 };
      }
      const result = new CleanCSS(options).minify(input);
      output = result.styles;
    } else if (mimeType === 'application/graphql') {
      // --- GraphQL ---
      // Strip # comments
      output = input.replace(/#[^\n]*/g, '');
      // Collapse whitespace
      output = output.replace(/\s+/g, ' ').trim();
      if (isExtreme) {
        // Remove spaces around structural characters
        output = output.replace(/\s*([{}():,])\s*/g, '$1');
      }
    }

    return { buffer: Buffer.from(output, 'utf8'), outMime: mimeType };
  } catch (error) {
    throw new Error(`Text/Code optimization failed: ${error.message}`);
  }
}

module.exports = { optimizeText };