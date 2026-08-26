# Practical Examples

Here are common examples illustrating the features of Condense v1.0.0.

---

## 1. Fluent Pipeline Chaining

```javascript
const { createPipeline } = require('@studioframes/condense');

// Resize, tune with SSIM, convert to WebP, and extract buffer
const optimizedBuffer = await createPipeline(inputImageBuffer, 'image/jpeg')
  .resize({ width: 1200, height: 800, fit: 'cover' })
  .perceptual({ targetSsim: 0.96, format: 'webp' })
  .toBuffer();
```

---

## 2. Perceptual Image Optimization with SSIM Search

```javascript
const { optimizePerceptualImage } = require('@studioframes/condense');

const result = await optimizePerceptualImage(rawPhotoBuffer, 'image/jpeg', {
  targetSsim: 0.95,
  format: 'avif',
});

console.log(`Final Quality: ${result.finalQuality}`);
console.log(`Measured SSIM: ${result.ssim}`);
console.log(`Output Size: ${result.buffer.length} bytes`);
```

---

## 3. Responsive Image Matrix with `<picture>` Tag

```javascript
const { generateResponsiveMatrix } = require('@studioframes/condense');

const { variants, html } = await generateResponsiveMatrix(rawImageBuffer, 'image/png', {
  widths: [320, 640, 1024, 1920],
  formats: ['avif', 'webp'],
  method: 'balanced',
});

// Embed the pre-generated markup directly into your frontend:
console.log(html);
```

---

## 4. In-Memory SVG Spritesheet Packing

```javascript
const { packSvgSprites } = require('@studioframes/condense');

const spritesheet = packSvgSprites([
  { id: 'icon-home', content: '<svg viewBox="0 0 24 24"><path d="..."/></svg>' },
  { id: 'icon-settings', content: '<svg viewBox="0 0 24 24"><path d="..."/></svg>' },
]);

// Result: <svg xmlns="http://www.w3.org/2000/svg"><defs><symbol id="icon-home" ...
```

---

## 5. In-Memory Recursive ZIP Archive Optimizer

```javascript
const { optimizeZip } = require('@studioframes/condense');
const fs = require('fs');

const rawZip = fs.readFileSync('bundle.zip');
const { buffer, originalSize, optimizedSize, processedFiles } = await optimizeZip(rawZip, {
  method: 'extreme',
  level: 9,
});

console.log(`Compressed ${processedFiles} assets: ${originalSize} -> ${optimizedSize} bytes`);
```

---

## 6. Coordinated Cross-Document Token Mangling

```javascript
const { mangleTokens } = require('@studioframes/condense');

const html = '<div class="main-navigation" id="hero-banner">Hello</div>';
const css = '.main-navigation { color: red; } #hero-banner { padding: 10px; }';
const js = 'document.querySelector(".main-navigation").classList.add("active");';

const mangled = mangleTokens({ html, css, js });
console.log(mangled.html);
console.log(mangled.css);
console.log(mangled.tokenMap);
```

---

## 7. Multi-Threaded Batch Optimization via Worker Pool

```javascript
const { getWorkerPool } = require('@studioframes/condense');

const pool = getWorkerPool({ maxWorkers: 4 });
const files = [/* array of buffers */];

const tasks = files.map(buf =>
  pool.execute('optimizeImage', { buffer: buf, mimeType: 'image/jpeg', method: 'balanced' })
);

const results = await Promise.all(tasks);
```

