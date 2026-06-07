const { minify: terserMinify } = require('terser');
const CleanCSS = require('clean-css');
const { minify: htmlMinify } = require('html-minifier-terser');
const { Parser } = require('htmlparser2');

function protectIgnoredTags(htmlString) {
    let output = '';
    let lastIndex = 0;
    let ignoreDepth = 0;

    const parser = new Parser({
        onopentag(name, attributes) {
            const hasIgnore = attributes['data-condense-ignore'] !== undefined;
            
            // If we hit a new ignored tag and aren't already inside one
            if (ignoreDepth === 0 && hasIgnore) {
                output += htmlString.substring(lastIndex, parser.startIndex);
                output += '<!-- htmlmin:ignore -->'; // Inject opening marker
                lastIndex = parser.startIndex;
                ignoreDepth++;
            } 
            // If we are already inside an ignored block, just track nesting depth
            else if (ignoreDepth > 0) {
                ignoreDepth++;
            }
        },
        onclosetag(name) {
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
        }
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

    try {
        // --- HTML ---
        if (mimeType === 'text/html') {
            // 1. Pre-process to protect elements with `data-condense-ignore`
            const protectedHtml = protectIgnoredTags(input);

            // 2. Configure Minifier
            const options = isExtreme 
                ? {
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyJS: true,
                    minifyCSS: true,
                    removeAttributeQuotes: true,
                    removeOptionalTags: true,
                    collapseBooleanAttributes: true
                } 
                : {
                    collapseWhitespace: true,
                    removeComments: true,
                    minifyJS: true,
                    minifyCSS: true
                };

            // 3. Minify (The minifier natively skips everything between our markers)
            const minified = await htmlMinify(protectedHtml, options);

            // 4. Strip out the temporary markers before returning
            output = minified.replace(/<!-- htmlmin:ignore -->/g, '');
        } 
        // --- JavaScript ---
        else if (mimeType === 'application/javascript' || mimeType === 'text/javascript') {
            if (input.includes('/* condense-ignore */')) return { buffer, outMime: mimeType };

            const options = isExtreme
                ? { compress: { passes: 2 }, mangle: { toplevel: true } }
                : { compress: true, mangle: true };
            
            const result = await terserMinify(input, options);
            output = result.code;
        } 
        // --- CSS ---
        else if (mimeType === 'text/css') {
            if (input.includes('/* condense-ignore */')) return { buffer, outMime: mimeType };

            const options = isExtreme ? { level: 2 } : { level: 1 };
            const result = new CleanCSS(options).minify(input);
            output = result.styles;
        } 
        // --- JSON ---
        else if (mimeType === 'application/json') {
            const parsed = JSON.parse(input);
            output = JSON.stringify(parsed);
        }

        return { buffer: Buffer.from(output, 'utf8'), outMime: mimeType };
    } catch (error) {
        throw new Error(`Text/Code optimization failed: ${error.message}`);
    }
}

module.exports = { optimizeText };