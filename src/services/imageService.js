const sharp = require('sharp');

async function optimizeImage(buffer, mimeType, method) {
    try {
        // Strip metadata natively on input buffer initialization
        let instance = sharp(buffer, { failOn: 'none' }).withMetadata(false);
        const isExtreme = method === 'extreme';
        let outMime = mimeType;

        if (isExtreme) {
            if (mimeType === 'image/png') {
                // Extreme PNG: Retain PNG format, reduce to 8-bit palette, extreme compression
                instance = instance.png({ palette: true, colors: 256, quality: 40, compressionLevel: 9 });
            } else {
                // Extreme ALL OTHERS: Force WebP, size & speed first, lower chroma subsampling
                instance = instance.webp({ quality: 40, smartSubsample: true, effort: 6 });
                outMime = 'image/webp';
            }
        } else {
            // Quality Method: Visually lossless, quality 80, optimize coding tables
            if (mimeType === 'image/jpeg') {
                instance = instance.jpeg({ quality: 80, optimizeCoding: true, mozjpeg: true });
            } else if (mimeType === 'image/png') {
                instance = instance.png({ quality: 80, palette: false });
            } else if (mimeType === 'image/webp') {
                instance = instance.webp({ quality: 80 });
            } else {
                // Fallback to WebP for unmatched formats (like TIFF/BMP)
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

module.exports = { optimizeImage };