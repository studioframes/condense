'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { optimizePdf } = require('../src/services/pdfService');

test('pdfService - strips comments and XML metadata packets from PDF', () => {
  const rawPdf = [
    '%PDF-1.7',
    '%âãÏÓ',
    '% Unneeded developer comment 1',
    '% Unneeded developer comment 2',
    '1 0 obj',
    '<< /Type /Catalog /Pages 2 0 R >>',
    'endobj',
    '<?xpacket begin="ï»¿" id="W5M0MpCehiHzreSzNTczkc9d"?>',
    '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"></rdf:RDF></x:xmpmeta>',
    '<?xpacket end="w"?>',
    '%%EOF',
  ].join('\n');

  const pdfBuffer = Buffer.from(rawPdf, 'binary');
  const result = optimizePdf(pdfBuffer, { method: 'extreme' });

  assert.ok(Buffer.isBuffer(result.buffer));
  assert.strictEqual(result.outMime, 'application/pdf');

  const outputStr = result.buffer.toString('binary');
  assert.ok(outputStr.startsWith('%PDF-1.7'));
  assert.ok(!outputStr.includes('Unneeded developer comment'));
  assert.ok(!outputStr.includes('xmpmeta'));
  assert.ok(result.buffer.length < pdfBuffer.length);
});
