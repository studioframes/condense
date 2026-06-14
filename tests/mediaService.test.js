const test = require('node:test');
const { optimizeMediaStream } = require('../src/services/mediaService');
const { assert } = require('./helpers');

test('mediaService - optimizeMediaStream returns stream object', (t) => {
  const testBuffer = Buffer.from([0xFF, 0xFB, 0x10, 0x00]);
  const result = optimizeMediaStream(testBuffer, 'audio/mpeg', 'quality');
  
  assert(result.stream, 'Should return stream object');
  assert(typeof result.stream.pipe === 'function', 'Stream should have pipe method');
  assert(result.outMime === 'audio/mpeg', 'Should return audio/mpeg mime');
  
  // Drain error events to prevent uncaught exceptions after test ends
  result.stream.on('error', () => {});
});

test('mediaService - optimizeMediaStream with video mime', (t) => {
  const testBuffer = Buffer.from([0x00, 0x00, 0x00, 0x20]);
  const result = optimizeMediaStream(testBuffer, 'video/mp4', 'quality');
  
  assert(result.stream, 'Should return stream');
  assert(result.outMime === 'video/mp4', 'Should return video/mp4 mime');
  
  result.stream.on('error', () => {});
});

test('mediaService - optimizeMediaStream handles quality mode', (t) => {
  const testBuffer = Buffer.from([0xFF, 0xFB, 0x10, 0x00]);
  const result = optimizeMediaStream(testBuffer, 'audio/mpeg', 'quality');
  
  assert(result.stream, 'Quality mode should work');
  
  result.stream.on('error', () => {});
});

test('mediaService - optimizeMediaStream handles extreme mode', (t) => {
  const testBuffer = Buffer.from([0xFF, 0xFB, 0x10, 0x00]);
  const result = optimizeMediaStream(testBuffer, 'audio/mpeg', 'extreme');
  
  assert(result.stream, 'Extreme mode should work');
  
  result.stream.on('error', () => {});
});

test('mediaService - optimizeMediaStream error handling', (t) => {
  return new Promise((resolve) => {
    const testBuffer = Buffer.from([0xFF, 0xFB, 0x10, 0x00]);
    const result = optimizeMediaStream(testBuffer, 'audio/mpeg', 'quality');
    
    result.stream.on('error', (err) => {
      assert(err.message.includes('FFmpeg'), 'Error should mention FFmpeg');
      resolve();
    });

    setTimeout(resolve, 2000);
  });
});
