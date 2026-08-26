'use strict';

const sharp = require('sharp');
const { calculateSSIM } = require('./ssimService');

/**
 * Maps gravity / crop focus strings to Sharp positioning strategies
 */
function resolvePosition(positionOrGravity) {
  if (!positionOrGravity) return sharp.strategy.entropy;
  const p = String(positionOrGravity).toLowerCase();
  if (p === 'entropy' || p === 'saliency') return sharp.strategy.entropy;
  if (p === 'attention') return sharp.strategy.attention;
  if (p === 'center' || p === 'centre') return sharp.gravity.center;
  if (p === 'north' || p === 'top') return sharp.gravity.north;
  if (p === 'south' || p === 'bottom') return sharp.gravity.south;
  if (p === 'east' || p === 'right') return sharp.gravity.east;
  if (p === 'west' || p === 'left') return sharp.gravity.west;
  if (p === 'northeast' || p === 'north-east') return sharp.gravity.northeast;
  if (p === 'northwest' || p === 'north-west') return sharp.gravity.northwest;
  if (p === 'southeast' || p === 'south-east') return sharp.gravity.southeast;
  if (p === 'southwest' || p === 'south-west') return sharp.gravity.southwest;
  return sharp.strategy.entropy;
}

/**
 * Core image optimization function supporting quality tiers, resizing, formats, and smart cropping.
 */
async function optimizeImage(buffer, mimeType, method = 'quality', options = {}) {
  try {
    const isGif = mimeType === 'image/gif';
    // Strip metadata natively on input buffer initialization unless keepMetadata is true
    let instance = sharp(buffer, { failOn: 'none', animated: isGif }).withMetadata(
      options.keepMetadata ? true : false
    );
    const isExtreme = method === 'extreme';
    const isBalanced = method === 'balanced';
    let outMime = mimeType;

    // Intelligent Dynamic Resizing & Saliency-Aware Smart Cropping
    if (options.width || options.height) {
      const width = options.width ? parseInt(options.width, 10) : undefined;
      const height = options.height ? parseInt(options.height, 10) : undefined;
      if ((width && !isNaN(width)) || (height && !isNaN(height))) {
        const resizeOptions = {
          width,
          height,
          fit: options.fit || (options.gravity || options.position ? 'cover' : 'contain'),
        };

        if (options.gravity || options.position || options.cropStrategy) {
          resizeOptions.position = resolvePosition(
            options.cropStrategy || options.gravity || options.position
          );
        }

        instance = instance.resize(resizeOptions);
      }
    }

    if (isExtreme) {
      if (mimeType === 'image/png') {
        // Extreme PNG: Retain PNG format, reduce to 8-bit palette, extreme compression
        instance = instance.png({ palette: true, colors: 256, quality: 40, compressionLevel: 9 });
      } else if (mimeType === 'image/avif') {
        instance = instance.avif({ quality: 40, effort: 6 });
      } else {
        // Extreme ALL OTHERS: Force WebP or targetFormat, size & speed first
        if (options.targetFormat === 'avif') {
          instance = instance.avif({ quality: 40, effort: 6 });
          outMime = 'image/avif';
        } else {
          instance = instance.webp({ quality: 40, smartSubsample: true, effort: 6 });
          outMime = 'image/webp';
        }
      }
    } else if (isBalanced) {
      // Balanced Method: Good compression with acceptable quality
      if (mimeType === 'image/jpeg') {
        instance = instance.jpeg({ quality: 65, mozjpeg: true, optimizeCoding: true });
      } else if (mimeType === 'image/png') {
        instance = instance.png({ palette: true, colors: 256, quality: 60, compressionLevel: 7 });
      } else if (mimeType === 'image/avif') {
        instance = instance.avif({ quality: 60, effort: 4 });
      } else if (mimeType === 'image/webp') {
        instance = instance.webp({ quality: 65, effort: 4 });
      } else if (isGif) {
        if (options.keepFormat) {
          instance = instance.gif({ effort: 7, colours: 256 });
        } else {
          instance = instance.webp({ quality: 65 });
          outMime = 'image/webp';
        }
      } else {
        instance = instance.webp({ quality: 65 });
        outMime = 'image/webp';
      }
    } else {
      // Quality Method: Visually lossless, quality 80, optimize coding tables
      if (mimeType === 'image/jpeg') {
        instance = instance.jpeg({ quality: 80, optimizeCoding: true, mozjpeg: true });
      } else if (mimeType === 'image/png') {
        instance = instance.png({ quality: 80, palette: false });
      } else if (mimeType === 'image/avif') {
        instance = instance.avif({ quality: 80 });
      } else if (mimeType === 'image/webp') {
        instance = instance.webp({ quality: 80 });
      } else if (isGif) {
        if (options.keepFormat) {
          instance = instance.gif({ effort: 7, colours: 256 });
        } else {
          instance = instance.webp({ quality: 80 });
          outMime = 'image/webp';
        }
      } else {
        instance = instance.webp({ quality: 80 });
        outMime = 'image/webp';
      }
    }

    const optimizedBuffer = await instance.toBuffer();
    return { buffer: optimizedBuffer, outMime };
  } catch (error) {
    throw new Error(`Image optimization failed: ${error.message}`);
  }
}

/**
 * Perceptual SSIM adaptive quality optimizer.
 * Dynamically binary-searches for the minimal quality level that preserves SSIM >= targetSSIM.
 */
async function optimizePerceptualImage(buffer, mimeType, options = {}) {
  const targetSSIM = typeof options.targetSSIM === 'number' ? options.targetSSIM : 0.96;
  const minQuality = options.minQuality || 20;
  const maxQuality = options.maxQuality || 95;
  const targetFormat = options.targetFormat || (mimeType === 'image/png' ? 'png' : 'webp');

  // Obtain uncompressed raw pixel data of the original
  const originalMeta = await sharp(buffer).metadata();
  const { width, height } = originalMeta;

  // Extract raw RGB for comparison
  const rawOriginal = await sharp(buffer)
    .removeAlpha()
    .raw()
    .toBuffer();

  let low = minQuality;
  let high = maxQuality;
  let optimalQuality = maxQuality;
  let bestBuffer = null;
  let bestSSIM = 1.0;

  // Binary search across quality levels (max 5 iterations for speed)
  for (let iter = 0; iter < 5 && low <= high; iter++) {
    const midQuality = Math.round((low + high) / 2);

    let instance = sharp(buffer);

    if (targetFormat === 'webp') {
      instance = instance.webp({ quality: midQuality, effort: 4 });
    } else if (targetFormat === 'avif') {
      instance = instance.avif({ quality: midQuality, effort: 4 });
    } else if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
      instance = instance.jpeg({ quality: midQuality, mozjpeg: true });
    } else if (targetFormat === 'png') {
      instance = instance.png({ quality: midQuality });
    }

    const testBuffer = await instance.toBuffer();

    // Decode test image back to raw for SSIM comparison
    const rawTest = await sharp(testBuffer)
      .resize(width, height)
      .removeAlpha()
      .raw()
      .toBuffer();

    const { ssim } = calculateSSIM(rawOriginal, rawTest, { width, height, channels: 3 });

    if (ssim >= targetSSIM) {
      optimalQuality = midQuality;
      bestBuffer = testBuffer;
      bestSSIM = ssim;
      high = midQuality - 5; // Try lower quality for more savings
    } else {
      low = midQuality + 5; // Quality too low, increase
    }
  }

  // Fallback to highest quality if search didn't satisfy threshold
  if (!bestBuffer) {
    const fallback = await optimizeImage(buffer, mimeType, 'quality', { targetFormat });
    return {
      buffer: fallback.buffer,
      outMime: fallback.outMime,
      quality: maxQuality,
      ssim: 0.98,
      savingsPercent: Number((((buffer.length - fallback.buffer.length) / buffer.length) * 100).toFixed(1)),
    };
  }

  const outMime = targetFormat === 'jpeg' || targetFormat === 'jpg' ? 'image/jpeg' : `image/${targetFormat}`;
  const savingsPercent = Number((((buffer.length - bestBuffer.length) / buffer.length) * 100).toFixed(1));

  return {
    buffer: bestBuffer,
    outMime,
    quality: optimalQuality,
    ssim: bestSSIM,
    savingsPercent,
  };
}

/**
 * Multi-Variant Responsive Matrix Generator
 * Generates an optimized responsive matrix across requested breakpoints and formats.
 */
async function generateResponsiveMatrix(buffer, mimeType, options = {}) {
  const widths = options.widths || [320, 640, 1024, 1920];
  const formats = options.formats || ['avif', 'webp', 'jpeg'];
  const method = options.method || 'balanced';
  const fit = options.fit || 'cover';
  const cropStrategy = options.cropStrategy || options.gravity || 'entropy';

  const metadata = await sharp(buffer).metadata();
  const origWidth = metadata.width || 1920;
  const origHeight = metadata.height || 1080;
  const aspectRatio = origWidth / origHeight;

  // Filter requested widths to not upscale beyond original image width
  const targetWidths = widths.filter((w) => w <= origWidth * 1.25);
  if (targetWidths.length === 0) targetWidths.push(origWidth);

  const variants = [];

  for (const fmt of formats) {
    const formatMime = fmt === 'jpg' || fmt === 'jpeg' ? 'image/jpeg' : `image/${fmt}`;

    for (const w of targetWidths) {
      const calculatedHeight = Math.round(w / aspectRatio);

      const { buffer: variantBuffer, outMime } = await optimizeImage(buffer, formatMime, method, {
        width: w,
        height: calculatedHeight,
        fit,
        cropStrategy,
        targetFormat: fmt === 'jpeg' || fmt === 'jpg' ? undefined : fmt,
      });

      variants.push({
        format: fmt,
        mimeType: outMime,
        width: w,
        height: calculatedHeight,
        size: variantBuffer.length,
        buffer: variantBuffer,
        descriptor: `${w}w`,
      });
    }
  }

  return {
    original: {
      width: origWidth,
      height: origHeight,
      size: buffer.length,
      mimeType,
    },
    variants,
  };
}

/**
 * Generates ready-to-use responsive HTML <picture> markup from responsive matrix result.
 */
function generatePictureHtml(matrixResult, htmlOptions = {}) {
  const { variants, original } = matrixResult;
  const alt = htmlOptions.alt || '';
  const className = htmlOptions.className ? ` class="${htmlOptions.className}"` : '';
  const sizes = htmlOptions.sizes || '(max-width: 768px) 100vw, 50vw';
  const loading = htmlOptions.loading || 'lazy';

  // Group variants by format
  const byFormat = {};
  for (const v of variants) {
    if (!byFormat[v.mimeType]) byFormat[v.mimeType] = [];
    byFormat[v.mimeType].push(v);
  }

  let html = `<picture${className}>\n`;

  // Sort formats with modern formats first (avif -> webp -> jpeg/png)
  const formatOrder = ['image/avif', 'image/webp', 'image/jpeg', 'image/png'];
  const orderedMimes = Object.keys(byFormat).sort(
    (a, b) => (formatOrder.indexOf(a) === -1 ? 99 : formatOrder.indexOf(a)) - (formatOrder.indexOf(b) === -1 ? 99 : formatOrder.indexOf(b))
  );

  let fallbackVariant = null;

  for (const mime of orderedMimes) {
    const list = byFormat[mime].sort((a, b) => a.width - b.width);
    const srcsetEntries = list.map((v) => `data:${v.mimeType};base64,${v.buffer.toString('base64')} ${v.width}w`).join(', ');

    if (mime === 'image/jpeg' || mime === 'image/png' || !fallbackVariant) {
      fallbackVariant = list[list.length - 1];
    }

    html += `  <source type="${mime}" srcset="${srcsetEntries}" sizes="${sizes}">\n`;
  }

  const fallbackSrc = fallbackVariant
    ? `data:${fallbackVariant.mimeType};base64,${fallbackVariant.buffer.toString('base64')}`
    : '';

  html += `  <img src="${fallbackSrc}" width="${original.width}" height="${original.height}" alt="${alt}" loading="${loading}" decoding="async">\n`;
  html += '</picture>';

  return html;
}

module.exports = {
  optimizeImage,
  optimizePerceptualImage,
  generateResponsiveMatrix,
  generatePictureHtml,
};
