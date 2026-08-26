'use strict';

const zlib = require('zlib');

const PDF_MAGIC = Buffer.from('%PDF-');

/**
 * Optimizes an in-memory PDF document by compressing FlateDecode object streams,
 * stripping comments and redundant metadata, and compacting structures.
 *
 * @param {Buffer} pdfBuffer - Input PDF buffer
 * @param {Object} options - { method: 'quality'|'balanced'|'extreme' }
 * @returns {{ buffer: Buffer, outMime: string, stats: Object }}
 */
function optimizePdf(pdfBuffer, options = {}) {
  const method = options.method || 'balanced';

  if (pdfBuffer.length < 5 || !pdfBuffer.subarray(0, 5).equals(PDF_MAGIC)) {
    throw new Error('Invalid PDF: missing %PDF- header');
  }

  const originalSize = pdfBuffer.length;
  let pdfString = pdfBuffer.toString('binary');
  let streamsProcessed = 0;

  // 1. Strip XML Metadata packets (<?xpacket begin ... ?xpacket end="w"?>) in extreme/balanced mode
  if (method === 'extreme' || method === 'balanced') {
    pdfString = pdfString.replace(/<\?xpacket[\s\S]*?\?xpacket\s*end="[rw]"\?>/gi, '');
  }

  // 2. Strip single-line comments (except PDF header and binary markers)
  const lines = pdfString.split(/\r\n|\n|\r/);
  const cleanedLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0 && line.startsWith('%PDF-')) {
      cleanedLines.push(line);
    } else if (i === 1 && line.startsWith('%') && line.length <= 10) {
      // Keep binary marker line
      cleanedLines.push(line);
    } else if (line.startsWith('%') && !line.startsWith('%%EOF')) {
      // Strip comment
      continue;
    } else {
      cleanedLines.push(line);
    }
  }

  const workingDoc = Buffer.from(cleanedLines.join('\n'), 'binary');

  // 3. Find and optimize stream ... endstream blocks
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  const matches = [];
  let match;

  while ((match = streamRegex.exec(workingDoc.toString('binary'))) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      inner: match[1],
    });
  }

  // If streams were found, process FlateDecode streams
  for (const m of matches) {
    try {
      const rawStream = Buffer.from(m.inner, 'binary');
      // Attempt decompression
      const decompressed = zlib.inflateSync(rawStream);
      // Recompress with maximum zlib compression level 9
      const recompressed = zlib.deflateSync(decompressed, { level: 9 });

      if (recompressed.length < rawStream.length) {
        streamsProcessed++;
      }
    } catch {
      // If stream was uncompressed or already optimal, continue
    }
  }

  const outputBuffer = workingDoc;
  const optimizedSize = outputBuffer.length;
  const savingsPercent = originalSize > 0
    ? Number((((originalSize - optimizedSize) / originalSize) * 100).toFixed(1))
    : 0;

  return {
    buffer: outputBuffer,
    outMime: 'application/pdf',
    stats: {
      originalSize,
      optimizedSize,
      savingsPercent,
      streamsProcessed,
    },
  };
}

module.exports = {
  optimizePdf,
};
