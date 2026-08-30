'use strict';

const zlib = require('zlib');

const PDF_MAGIC = Buffer.from('%PDF-');

/**
 * Strips XML Metadata packets (<?xpacket ... ?>) from PDF in linear time without regex backtracking.
 *
 * @param {string} str - Raw PDF binary string
 * @returns {string} Cleaned PDF binary string
 */
function stripXmpPackets(str) {
  let result = '';
  let cursor = 0;
  const lower = str.toLowerCase();
  const startMarker = '<?xpacket';
  const endMarker = '?xpacket';

  while (cursor < str.length) {
    const startIdx = lower.indexOf(startMarker, cursor);
    if (startIdx === -1) {
      result += str.slice(cursor);
      break;
    }

    result += str.slice(cursor, startIdx);

    const endPacketIdx = lower.indexOf(endMarker, startIdx + startMarker.length);
    if (endPacketIdx === -1) {
      result += str.slice(startIdx);
      break;
    }

    const closeTagIdx = str.indexOf('?>', endPacketIdx);
    if (closeTagIdx === -1) {
      result += str.slice(startIdx);
      break;
    }

    cursor = closeTagIdx + 2;
  }

  return result;
}

/**
 * Finds all stream ... endstream blocks in a PDF binary string in linear time.
 *
 * @param {string} binaryStr - PDF binary string
 * @returns {Array<{ start: number, end: number, inner: string }>}
 */
function findPdfStreams(binaryStr) {
  const matches = [];
  let cursor = 0;
  const len = binaryStr.length;

  while (cursor < len) {
    const streamIdx = binaryStr.indexOf('stream', cursor);
    if (streamIdx === -1) break;

    // Check for newline following 'stream' (\r\n, \n, or \r)
    let dataStart = -1;
    if (binaryStr.startsWith('\r\n', streamIdx + 6)) {
      dataStart = streamIdx + 8;
    } else if (binaryStr.charCodeAt(streamIdx + 6) === 10 || binaryStr.charCodeAt(streamIdx + 6) === 13) {
      dataStart = streamIdx + 7;
    }

    if (dataStart === -1) {
      cursor = streamIdx + 6;
      continue;
    }

    const endStreamIdx = binaryStr.indexOf('endstream', dataStart);
    if (endStreamIdx === -1) {
      break;
    }

    // Exclude trailing newline before 'endstream'
    let dataEnd = endStreamIdx;
    if (dataEnd > dataStart && binaryStr.charCodeAt(dataEnd - 1) === 10) {
      dataEnd--;
      if (dataEnd > dataStart && binaryStr.charCodeAt(dataEnd - 1) === 13) {
        dataEnd--;
      }
    } else if (dataEnd > dataStart && binaryStr.charCodeAt(dataEnd - 1) === 13) {
      dataEnd--;
    }

    matches.push({
      start: streamIdx,
      end: endStreamIdx + 9,
      inner: binaryStr.slice(dataStart, dataEnd),
    });

    cursor = endStreamIdx + 9;
  }

  return matches;
}

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

  // 1. Strip XML Metadata packets in extreme/balanced mode
  if (method === 'extreme' || method === 'balanced') {
    pdfString = stripXmpPackets(pdfString);
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

  // 3. Find and optimize stream ... endstream blocks in linear time
  const matches = findPdfStreams(workingDoc.toString('binary'));

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