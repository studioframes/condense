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

test('pdfService - safely handles adversarial / repeated prefixes without ReDoS', () => {
  const adversarialPdf = [
    '%PDF-1.4',
    '%âãÏÓ',
    // Repeated xpacket prefixes without matching closing tags
    '<?xpacket '.repeat(500),
    '<?xpacket begin="a" id="b"?>',
    '<x:xmpmeta>meta</x:xmpmeta>',
    '<?xpacket end="r"?>',
    // Repeated stream markers without endstream
    'stream\n'.repeat(500),
    '2 0 obj',
    '<< /Length 10 >>',
    'stream',
    'sample content',
    'endstream',
    'endobj',
    '%%EOF',
  ].join('\n');

  const start = Date.now();
  const result = optimizePdf(Buffer.from(adversarialPdf, 'binary'), { method: 'balanced' });
  const elapsed = Date.now() - start;

  assert.ok(elapsed < 200, `Execution took ${elapsed}ms, should be linear and < 200ms`);
  assert.ok(Buffer.isBuffer(result.buffer));
});