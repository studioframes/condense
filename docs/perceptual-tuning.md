# Perceptual Image Tuning & Responsive Matrix Guide

Condense v1.0.0 introduces **Pillar 1: Next-Gen Intelligence & Perceptual Compression**, moving beyond arbitrary quality percentages to mathematically verifiable visual fidelity.

---

## 1. Why Perceptual Compression?

Standard lossy compression tools ask for a fixed quality setting (e.g. `quality: 80`). However:
- A simple graphic or flat-color logo might be imperceptibly perfect at `quality: 45`.
- A complex photograph with fine textures and film grain might noticeably degrade below `quality: 88`.

Using a fixed quality number either wastes bandwidth or produces visible compression artifacts. Condense solves this with **Binary Search Perceptual Quality Tuning**.

---

## 2. Structural Similarity Index (SSIM) & PSNR

Condense calculates:
- **SSIM (Structural Similarity Index Measure)**: Evaluates luminance, contrast, and structural similarity on a scale from `0.0` (complete distortion) to `1.0` (identical).
- **PSNR (Peak Signal-to-Noise Ratio)**: Measures logarithmic noise ratio in decibels ($\text{dB}$).

### Quality Reference Scale

| Target SSIM | Visual Description | Recommended Use Case |
| :--- | :--- | :--- |
| **`0.98 - 1.00`** | Visually indistinguishable from source | Hero photography, high-end portfolio assets, fine art |
| **`0.94 - 0.97`** | Excellent fidelity, imperceptible artifacts | Standard e-commerce, web marketing, product displays |
| **`0.88 - 0.93`** | Minor artifacts visible only upon close inspection | Thumbnails, user avatars, bandwidth-constrained mobile feeds |
| **`< 0.88`** | Noticeable blur or compression noise | Extreme bandwidth saver mode |

---

## 3. Programmatic Usage: `optimizePerceptualImage`

```javascript
const { optimizePerceptualImage } = require('@studioframes/condense');

const result = await optimizePerceptualImage(imageBuffer, 'image/jpeg', {
  targetSsim: 0.95,       // Target SSIM threshold (0.0 to 1.0)
  targetPsnr: 35.0,       // Optional minimum PSNR in dB
  format: 'webp',         // Output format ('webp', 'avif', 'jpeg', 'png')
  maxIterations: 6,       // Maximum binary search iterations (default: 6)
  minQuality: 20,         // Search lower bound (default: 20)
  maxQuality: 95,         // Search upper bound (default: 95)
});

console.log(`Final Quality: ${result.finalQuality}`);
console.log(`Measured SSIM: ${result.ssim}`);
console.log(`Output Buffer: ${result.buffer.length} bytes`);
```

---

## 4. Responsive Image Matrix Generation

Modern web standards require serving responsive image variants tailored to the user's viewport width and device pixel ratio (DPR), using modern formats with fallback support.

`generateResponsiveMatrix` automates the generation of:
1. Multi-resolution image buffers across custom or standard breakpoints (`320px`, `640px`, `1024px`, `1920px`).
2. Next-gen format variants (`AVIF` and `WebP`).
3. Pre-formatted, semantic HTML5 `<picture>` markup.

### Example

```javascript
const { generateResponsiveMatrix } = require('@studioframes/condense');

const matrix = await generateResponsiveMatrix(sourceBuffer, 'image/png', {
  widths: [320, 640, 1024, 1920],
  formats: ['avif', 'webp'],
  method: 'balanced',
});

// Access generated binary variants
for (const variant of matrix.variants) {
  console.log(`${variant.format} @ ${variant.width}w: ${variant.byteLength} bytes`);
}

// Embed the generated HTML markup directly
console.log(matrix.html);
```

### Generated HTML Output Example

```html
<picture>
  <source type="image/avif" srcset="image-320w.avif 320w, image-640w.avif 640w, image-1024w.avif 1024w, image-1920w.avif 1920w" sizes="(max-width: 1024px) 100vw, 1024px">
  <source type="image/webp" srcset="image-320w.webp 320w, image-640w.webp 640w, image-1024w.webp 1024w, image-1920w.webp 1920w" sizes="(max-width: 1024px) 100vw, 1024px">
  <img src="image-1024w.webp" width="1024" alt="" loading="lazy" decoding="async">
</picture>
```
