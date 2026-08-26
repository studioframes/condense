'use strict';

const SFNT_TTF = 0x00010000;
const SFNT_OTTO = 0x4f54544f; // 'OTTO' (CFF)
const SFNT_TRUE = 0x74727565; // 'true'
const WOFF_MAGIC = 0x774f4646; // 'wOFF'
const WOFF2_MAGIC = 0x774f4632; // 'wOF2'

// Tables that are safe to strip without altering glyph rendering in modern browsers
const DISCARDABLE_TABLES = new Set([
  'DSIG', // Digital Signature
  'VDMX', // Vertical Device Metrics
  'LTSH', // Linear Threshold
  'hdmx', // Horizontal Device Metrics
  'PCLT', // PCL 5 table
  'meta', // Metadata
  'feat', // Feature Name
]);

/**
 * Optimizes an in-memory TrueType or OpenType (TTF / OTF / WOFF) font binary.
 *
 * @param {Buffer} fontBuffer - Raw font binary
 * @param {Object} options - { method: 'quality'|'balanced'|'extreme', stripTables?: string[] }
 * @returns {{ buffer: Buffer, outMime: string, stats: Object }}
 */
function optimizeFont(fontBuffer, options = {}) {
  if (fontBuffer.length < 12) {
    throw new Error('Invalid font binary: buffer too small');
  }

  const magic = fontBuffer.readUInt32BE(0);
  let outMime = 'font/ttf';

  if (magic === SFNT_OTTO) {
    outMime = 'font/otf';
  } else if (magic === WOFF_MAGIC) {
    outMime = 'font/woff';
  } else if (magic === WOFF2_MAGIC) {
    outMime = 'font/woff2';
  }

  // If WOFF or WOFF2, font is already compressed, perform table cleaning where applicable
  if (magic !== SFNT_TTF && magic !== SFNT_OTTO && magic !== SFNT_TRUE) {
    // Return buffer with proper mime
    return {
      buffer: fontBuffer,
      outMime,
      stats: {
        originalSize: fontBuffer.length,
        optimizedSize: fontBuffer.length,
        savingsPercent: 0,
        tablesRemoved: [],
      },
    };
  }

  const numTables = fontBuffer.readUInt16BE(4);
  const tables = [];
  const tablesToRemove = new Set(DISCARDABLE_TABLES);

  if (options.stripTables) {
    for (const t of options.stripTables) tablesToRemove.add(t);
  }

  let tableDirOffset = 12;
  const removedTableNames = [];

  for (let i = 0; i < numTables; i++) {
    const tag = fontBuffer.toString('ascii', tableDirOffset, tableDirOffset + 4);
    const checksum = fontBuffer.readUInt32BE(tableDirOffset + 4);
    const offset = fontBuffer.readUInt32BE(tableDirOffset + 8);
    const length = fontBuffer.readUInt32BE(tableDirOffset + 12);

    tableDirOffset += 16;

    if (tablesToRemove.has(tag)) {
      removedTableNames.push(tag);
      continue;
    }

    const tableData = fontBuffer.subarray(offset, offset + length);
    tables.push({ tag, checksum, offset, length, data: tableData });
  }

  // If no tables were stripped, return original
  if (removedTableNames.length === 0) {
    return {
      buffer: fontBuffer,
      outMime,
      stats: {
        originalSize: fontBuffer.length,
        optimizedSize: fontBuffer.length,
        savingsPercent: 0,
        tablesRemoved: [],
      },
    };
  }

  // Re-serialize SFNT font
  const newNumTables = tables.length;
  // Calculate binary search parameters for header
  let searchRange = 1;
  let entrySelector = 0;
  while (searchRange * 2 <= newNumTables) {
    searchRange *= 2;
    entrySelector++;
  }
  searchRange *= 16;
  const rangeShift = newNumTables * 16 - searchRange;

  const header = Buffer.alloc(12);
  header.writeUInt32BE(magic, 0);
  header.writeUInt16BE(newNumTables, 4);
  header.writeUInt16BE(searchRange, 6);
  header.writeUInt16BE(entrySelector, 8);
  header.writeUInt16BE(rangeShift, 10);

  const tableDirectory = Buffer.alloc(newNumTables * 16);
  let currentDataOffset = 12 + newNumTables * 16;

  // Sort tables alphabetically by tag (OpenType specification requirement)
  tables.sort((a, b) => a.tag.localeCompare(b.tag));

  const tableDataBlocks = [];

  for (let i = 0; i < newNumTables; i++) {
    const t = tables[i];
    // Table offsets must be aligned to 4-byte boundaries
    const paddedLength = Math.ceil(t.length / 4) * 4;
    const padding = Buffer.alloc(paddedLength - t.length, 0);

    const dirEntryOffset = i * 16;
    tableDirectory.write(t.tag, dirEntryOffset, 4, 'ascii');
    tableDirectory.writeUInt32BE(t.checksum, dirEntryOffset + 4);
    tableDirectory.writeUInt32BE(currentDataOffset, dirEntryOffset + 8);
    tableDirectory.writeUInt32BE(t.length, dirEntryOffset + 12);

    tableDataBlocks.push(t.data);
    if (padding.length > 0) {
      tableDataBlocks.push(padding);
    }

    currentDataOffset += paddedLength;
  }

  const outputBuffer = Buffer.concat([header, tableDirectory, ...tableDataBlocks]);
  const savingsPercent = Number((((fontBuffer.length - outputBuffer.length) / fontBuffer.length) * 100).toFixed(1));

  return {
    buffer: outputBuffer,
    outMime,
    stats: {
      originalSize: fontBuffer.length,
      optimizedSize: outputBuffer.length,
      savingsPercent,
      tablesRemoved: removedTableNames,
    },
  };
}

module.exports = {
  optimizeFont,
};
