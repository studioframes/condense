const test = require('node:test');
const { optimizeText } = require('../src/services/textService');
const { assert } = require('./helpers');

test('textService - optimizeText with JavaScript', async (t) => {
  const jsCode = `
    function test( ) {
      var x = 10;
      return x;
    }
  `;
  const buffer = Buffer.from(jsCode);
  const result = await optimizeText(buffer, 'application/javascript', 'quality');
  
  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'application/javascript', 'Should return JS mime');
  assert(result.buffer.length < buffer.length, 'Output should be smaller');
});

test('textService - optimizeText with CSS', async (t) => {
  const css = `
    body {
      margin: 0;
      padding: 0;
    }
  `;
  const buffer = Buffer.from(css);
  const result = await optimizeText(buffer, 'text/css', 'quality');
  
  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'text/css', 'Should return CSS mime');
});

test('textService - optimizeText with HTML', async (t) => {
  const html = `
    <html>
      <body>
        <p>  Hello   World  </p>
      </body>
    </html>
  `;
  const buffer = Buffer.from(html);
  const result = await optimizeText(buffer, 'text/html', 'quality');
  
  assert(Buffer.isBuffer(result.buffer), 'Should return a buffer');
  assert(result.outMime === 'text/html', 'Should return HTML mime');
});

test('textService - optimizeText respects condense-ignore', async (t) => {
  const html = `<div data-condense-ignore><p>   Keep spaces   </p></div>`;
  const buffer = Buffer.from(html);
  const result = await optimizeText(buffer, 'text/html', 'quality');
  
  const output = result.buffer.toString();
  assert(output.includes('   '), 'Should preserve spaces in ignored sections');
});
