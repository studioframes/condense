'use strict';

const WASM_MAGIC = Buffer.from([0x00, 0x61, 0x73, 0x6d]);
const OUT_MIME = 'application/wasm';

const STRIP_NAMES = new Set([
  'name',
  'producers',
  'sourceMappingURL',
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

  if (sectionName.startsWith('.debug')) {
    return true;
  }

  return false;
}

function optimizeWasm(buffer, method) {
  try {
    if (buffer.length < 4 || !buffer.subarray(0, 4).equals(WASM_MAGIC)) {
      throw new Error('Invalid WebAssembly binary: missing magic bytes');
    }

    const version = buffer.subarray(4, 8);
    let offset = 8;
    const keptSections = [];

    while (offset < buffer.length) {
      const sectionId = buffer[offset];
      offset += 1;

      const { value: sectionSize, bytesRead } = readLEB128(buffer, offset);
      offset += bytesRead;

      const payload = buffer.subarray(offset, offset + sectionSize);
      offset += sectionSize;

      if (sectionId === 0) {
        // Custom section — read the name to decide whether to strip
        const { value: nameLen, bytesRead: nameLenBytes } = readLEB128(payload, 0);
        const sectionName = payload.subarray(nameLenBytes, nameLenBytes + nameLen).toString('utf-8');

        if (shouldStripCustomSection(sectionName, method)) {
          continue;
        }
      }

      keptSections.push({ sectionId, payload });
    }

    // Rebuild binary
    const parts = [WASM_MAGIC, version];

    for (const section of keptSections) {
      const idBuf = Buffer.from([section.sectionId]);
      const sizeBuf = encodeLEB128(section.payload.length);
      parts.push(idBuf, sizeBuf, section.payload);
    }

    return {
      buffer: Buffer.concat(parts),
      outMime: OUT_MIME,
    };
  } catch (error) {
    if (error.message.startsWith('Invalid WebAssembly binary')) {
      throw error;
    }
    throw new Error('WebAssembly optimization failed: ' + error.message);
  }
}

module.exports = { optimizeWasm };
