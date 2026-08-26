'use strict';

const WASM_MAGIC = Buffer.from([0x00, 0x61, 0x73, 0x6d]);
const OUT_MIME = 'application/wasm';

const STRIP_NAMES = new Set([
  'name',
  'producers',
  'sourceMappingURL',
  'target_features',
  'external_debug_info',
  'build_id',
]);

function readLEB128(buf, offset) {
  let value = 0;
  let shift = 0;
  let bytesRead = 0;
  let byte;

  do {
    byte = buf[offset + bytesRead];
    value |= (byte & 0x7f) << shift;
    shift += 7;
    bytesRead++;
  } while (byte & 0x80);

  return { value, bytesRead };
}

function encodeLEB128(value) {
  const bytes = [];

  do {
    let byte = value & 0x7f;
    value >>>= 7;
    if (value !== 0) {
      byte |= 0x80;
    }
    bytes.push(byte);
  } while (value !== 0);

  return Buffer.from(bytes);
}

function shouldStripCustomSection(sectionName, method) {
  if (method === 'extreme') {
    return true;
  }

  if (STRIP_NAMES.has(sectionName)) {
    return true;
  }

  if (sectionName.startsWith('.debug') || sectionName.startsWith('debug_')) {
    return true;
  }

  if (method === 'balanced' && (sectionName.startsWith('metadata.') || sectionName.startsWith('reloc.'))) {
    return true;
  }

  return false;
}

/**
 * Deep WebAssembly binary optimization and custom section pruning.
 *
 * @param {Buffer} buffer - Raw WASM binary buffer
 * @param {'quality'|'balanced'|'extreme'} method - Optimization tier
 * @returns {{ buffer: Buffer, outMime: string, stats?: Object }}
 */
function optimizeWasm(buffer, method = 'quality') {
  try {
    if (buffer.length < 4 || !buffer.subarray(0, 4).equals(WASM_MAGIC)) {
      throw new Error('Invalid WebAssembly binary: missing magic bytes');
    }

    const originalSize = buffer.length;
    const version = buffer.subarray(4, 8);
    let offset = 8;
    const keptSections = [];
    let strippedCustomSections = 0;

    while (offset < buffer.length) {
      const sectionId = buffer[offset];
      offset += 1;

      const { value: sectionSize, bytesRead } = readLEB128(buffer, offset);
      offset += bytesRead;

      const payload = buffer.subarray(offset, offset + sectionSize);
      offset += sectionSize;

      if (sectionId === 0) {
        // Custom section — inspect section name to decide whether to strip
        const { value: nameLen, bytesRead: nameLenBytes } = readLEB128(payload, 0);
        const sectionName = payload
          .subarray(nameLenBytes, nameLenBytes + nameLen)
          .toString('utf-8');

        if (shouldStripCustomSection(sectionName, method)) {
          strippedCustomSections++;
          continue;
        }
      }

      keptSections.push({ sectionId, payload });
    }

    // Rebuild binary parts with exact LEB128 sizing
    const parts = [WASM_MAGIC, version];

    for (const section of keptSections) {
      const idBuf = Buffer.from([section.sectionId]);
      const sizeBuf = encodeLEB128(section.payload.length);
      parts.push(idBuf, sizeBuf, section.payload);
    }

    const outputBuffer = Buffer.concat(parts);
    const savingsPercent = originalSize > 0
      ? Number((((originalSize - outputBuffer.length) / originalSize) * 100).toFixed(1))
      : 0;

    return {
      buffer: outputBuffer,
      outMime: OUT_MIME,
      stats: {
        originalSize,
        optimizedSize: outputBuffer.length,
        savingsPercent,
        strippedCustomSections,
      },
    };
  } catch (error) {
    if (error.message.startsWith('Invalid WebAssembly binary')) {
      throw error;
    }
    throw new Error('WebAssembly optimization failed: ' + error.message);
  }
}

module.exports = { optimizeWasm };
