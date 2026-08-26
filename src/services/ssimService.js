'use strict';

/**
 * Fast Structural Similarity Index Measure (SSIM) and Perceptual Difference
 * calculation between two raw pixel buffers in Node.js.
 */

// SSIM constants for 8-bit image data (dynamic range L = 255)
const K1 = 0.01;
const K2 = 0.03;
const L = 255;
const C1 = Math.pow(K1 * L, 2); // 6.5025
const C2 = Math.pow(K2 * L, 2); // 58.5225

/**
 * Convert RGB/RGBA buffer to 8-bit Luminance (Grayscale) array.
 * Y = 0.299 * R + 0.587 * G + 0.114 * B
 */
function toLuminance(rawBuffer, channels = 3) {
  const pixelCount = Math.floor(rawBuffer.length / channels);
  const luma = new Float32Array(pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    const offset = i * channels;
    const r = rawBuffer[offset];
    const g = rawBuffer[offset + 1];
    const b = rawBuffer[offset + 2];
    luma[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  return luma;
}

/**
 * Calculate mean of a float array
 */
function calculateMean(data, start, end) {
  let sum = 0;
  const count = end - start;
  for (let i = start; i < end; i++) {
    sum += data[i];
  }
  return sum / count;
}

/**
 * Calculate variance and covariance between two float arrays
 */
function calculateStats(dataX, dataY, start, end, meanX, meanY) {
  let varX = 0;
  let varY = 0;
  let covXY = 0;
  const count = end - start;

  for (let i = start; i < end; i++) {
    const diffX = dataX[i] - meanX;
    const diffY = dataY[i] - meanY;
    varX += diffX * diffX;
    varY += diffY * diffY;
    covXY += diffX * diffY;
  }

  return {
    varianceX: varX / count,
    varianceY: varY / count,
    covarianceXY: covXY / count,
  };
}

/**
 * Computes the Mean Structural Similarity Index (MSSIM) between two equal-sized raw pixel buffers.
 * @param {Buffer} rawBufferA - Raw pixel buffer of original image
 * @param {Buffer} rawBufferB - Raw pixel buffer of compressed image
 * @param {Object} options - { width, height, channels, windowSize }
 * @returns {{ ssim: number, mssim: number, score: number }}
 */
function calculateSSIM(rawBufferA, rawBufferB, options = {}) {
  const width = options.width;
  const height = options.height;
  const channels = options.channels || 3;
  const windowSize = options.windowSize || 8;

  if (!width || !height) {
    throw new Error('Width and height are required for SSIM calculation');
  }

  const lumaA = toLuminance(rawBufferA, channels);
  const lumaB = toLuminance(rawBufferB, channels);

  if (lumaA.length !== lumaB.length) {
    throw new Error('Image dimensions mismatch for SSIM comparison');
  }

  let totalSSIM = 0;
  let windowsCount = 0;

  const numX = Math.floor(width / windowSize);
  const numY = Math.floor(height / windowSize);

  // If image is smaller than standard 8x8 window, calculate globally
  if (numX === 0 || numY === 0) {
    const meanA = calculateMean(lumaA, 0, lumaA.length);
    const meanB = calculateMean(lumaB, 0, lumaB.length);
    const { varianceX, varianceY, covarianceXY } = calculateStats(
      lumaA,
      lumaB,
      0,
      lumaA.length,
      meanA,
      meanB
    );

    const numerator = (2 * meanA * meanB + C1) * (2 * covarianceXY + C2);
    const denominator =
      (meanA * meanA + meanB * meanB + C1) * (varianceX + varianceY + C2);
    const ssim = denominator === 0 ? 1 : numerator / denominator;
    return { ssim: Math.max(0, Math.min(1, ssim)), mssim: ssim, score: ssim };
  }

  // Sliding / block window calculation across width and height
  for (let wy = 0; wy < numY; wy++) {
    for (let wx = 0; wx < numX; wx++) {
      const windowA = new Float32Array(windowSize * windowSize);
      const windowB = new Float32Array(windowSize * windowSize);
      let idx = 0;

      for (let y = 0; y < windowSize; y++) {
        const rowOffset = (wy * windowSize + y) * width + wx * windowSize;
        for (let x = 0; x < windowSize; x++) {
          windowA[idx] = lumaA[rowOffset + x];
          windowB[idx] = lumaB[rowOffset + x];
          idx++;
        }
      }

      const meanA = calculateMean(windowA, 0, windowA.length);
      const meanB = calculateMean(windowB, 0, windowB.length);
      const { varianceX, varianceY, covarianceXY } = calculateStats(
        windowA,
        windowB,
        0,
        windowA.length,
        meanA,
        meanB
      );

      const numerator = (2 * meanA * meanB + C1) * (2 * covarianceXY + C2);
      const denominator =
        (meanA * meanA + meanB * meanB + C1) * (varianceX + varianceY + C2);
      const windowSSIM = denominator === 0 ? 1 : numerator / denominator;

      totalSSIM += windowSSIM;
      windowsCount++;
    }
  }

  const mssim = windowsCount > 0 ? totalSSIM / windowsCount : 1;
  const clampedSSIM = Math.max(0, Math.min(1, mssim));

  return {
    ssim: Number(clampedSSIM.toFixed(4)),
    mssim: Number(mssim.toFixed(4)),
    score: Number(clampedSSIM.toFixed(4)),
  };
}

/**
 * Calculates Peak Signal-to-Noise Ratio (PSNR) in dB
 */
function calculatePSNR(rawBufferA, rawBufferB, _channels = 3) {
  let mse = 0;

  for (let i = 0; i < rawBufferA.length; i++) {
    const diff = rawBufferA[i] - rawBufferB[i];
    mse += diff * diff;
  }

  mse /= rawBufferA.length;
  if (mse === 0) return { psnr: Infinity, mse: 0 };

  const psnr = 10 * Math.log10((255 * 255) / mse);
  return { psnr: Number(psnr.toFixed(2)), mse: Number(mse.toFixed(4)) };
}

module.exports = {
  calculateSSIM,
  calculatePSNR,
  toLuminance,
};
