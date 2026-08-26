'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { optimizeFont } = require('../src/services/fontService');

test('fontService - strips discardable tables from SFNT TrueType font', () => {
  // Construct a minimal SFNT structure with head, cmap, and DSIG (digital signature) table
  const numTables = 3;
  const header = Buffer.alloc(12);
  header.writeUInt32BE(0x00010000, 0); // SFNT TTF magic
  header.writeUInt16BE(numTables, 4);
  header.writeUInt16BE(32, 6); // searchRange
  header.writeUInt16BE(1, 8); // entrySelector
  header.writeUInt16BE(16, 10); // rangeShift

  const tableDir = Buffer.alloc(numTables * 16);

  const headData = Buffer.from('1234567812345678');
  const cmapData = Buffer.from('abcdefghabcdefgh');
  const dsigData = Buffer.from('DISCARDABLE_SIGNATURE_DATA_THAT_CAN_BE_STRIPPED');

  const offsetHead = 12 + numTables * 16;
  const offsetCmap = offsetHead + headData.length;
  const offsetDsig = offsetCmap + cmapData.length;

  // Table 1: head
  tableDir.write('head', 0, 4, 'ascii');
  tableDir.writeUInt32BE(12345, 4);
  tableDir.writeUInt32BE(offsetHead, 8);
  tableDir.writeUInt32BE(headData.length, 12);

  // Table 2: cmap
  tableDir.write('cmap', 16, 4, 'ascii');
  tableDir.writeUInt32BE(54321, 20);
  tableDir.writeUInt32BE(offsetCmap, 24);
  tableDir.writeUInt32BE(cmapData.length, 28);

  // Table 3: DSIG (to be stripped)
  tableDir.write('DSIG', 32, 4, 'ascii');
  tableDir.writeUInt32BE(99999, 36);
  tableDir.writeUInt32BE(offsetDsig, 40);
  tableDir.writeUInt32BE(dsigData.length, 44);

  const fontBuffer = Buffer.concat([header, tableDir, headData, cmapData, dsigData]);

  const result = optimizeFont(fontBuffer);

  assert.ok(Buffer.isBuffer(result.buffer));
  assert.strictEqual(result.outMime, 'font/ttf');
  assert.ok(result.stats.tablesRemoved.includes('DSIG'));
  assert.ok(result.buffer.length < fontBuffer.length);
  assert.strictEqual(result.buffer.readUInt16BE(4), 2); // 2 tables left
});
