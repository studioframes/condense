# Fluent Pipeline Guide

The Fluent Pipeline API (`createPipeline`) provides a chainable, builder-style interface for composing multi-step optimization, transformation, and preset workflows on in-memory buffers or strings.

---

## 1. Overview & Core Concept

Instead of calling disparate service functions individually, `createPipeline` allows you to declare a sequence of operations that execute in sequence and output either a `Buffer` or a readable `Stream`.

```javascript
const { createPipeline } = require('@studioframes/condense');

const outputBuffer = await createPipeline(inputBuffer, 'image/jpeg')
  .resize({ width: 1200, height: 800, fit: 'cover' })
  .perceptual({ targetSsim: 0.95, format: 'webp' })
  .toBuffer();
```

---

## 2. Pipeline Methods

### `createPipeline(input, mimeType)`
Initializes a new pipeline instance.
- **`input`**: `Buffer` or `string`.
- **`mimeType`**: MIME type string (e.g., `'image/jpeg'`, `'text/html'`, `'application/javascript'`).

---

### `.preset(presetName)`
Applies a built-in or custom registered preset configuration.

```javascript
const result = await createPipeline(avatarBuffer, 'image/png')
  .preset('avatar-thumbnail')
  .toBuffer();
```

**Built-In Presets:**
- `'web-hero'`: High-resolution hero imagery (target SSIM 0.96, WebP/AVIF format).
- `'avatar-thumbnail'`: 256x256 cover fit square avatar, quality 75.
- `'production-bundle'`: Aggressive code minification with comment and console removal.
- `'ultra-archive'`: In-memory recursive ZIP compression at DEFLATE level 9.
- `'email-safe'`: High-compatibility HTML and JPEG minification.
- `'social-share'`: 1200x630 social preview card formatting.

---

### `.resize({ width, height, fit })`
Applies dynamic dimensions and fitting modes to raster image buffers.
- **`width`**: Target width in pixels.
- **`height`**: Target height in pixels.
- **`fit`**: Resize fit strategy (`'cover'`, `'contain'`, `'fill'`, `'inside'`, `'outside'`).

```javascript
pipeline.resize({ width: 800, height: 600, fit: 'inside' });
```

---

### `.perceptual(options)`
Applies perceptual binary-search image tuning targeting structural similarity (SSIM).
- **`targetSsim`** (number, default: `0.95`): SSIM index between 0.0 and 1.0.
- **`targetPsnr`** (number, optional): Minimum PSNR threshold in decibels (dB).
- **`format`** (string, optional): Target format (`'webp'`, `'avif'`, `'jpeg'`, `'png'`).

```javascript
pipeline.perceptual({ targetSsim: 0.96, format: 'avif' });
```

---

### `.minify(options)`
Applies code and markup minification for text assets (HTML, CSS, JS, TS, JSX, JSON, YAML, etc.).
- **`method`**: `'quality'`, `'balanced'`, or `'extreme'` (default: `'balanced'`).

```javascript
pipeline.minify({ method: 'extreme' });
```

---

### `.transform(fn)`
Inserts a custom transform step into the execution chain.
- **`fn`**: `async (buffer: Buffer, context: object) => Buffer`

```javascript
pipeline.transform(async (buf, ctx) => {
  console.log(`Current size in pipeline: ${buf.length} bytes`);
  return buf;
});
```

---

### Terminal Execution Methods

#### `.toBuffer()`
Executes all registered pipeline steps sequentially and resolves with the final `Buffer`.

```javascript
const finalBuffer = await pipeline.toBuffer();
```

#### `.toStream()`
Executes all pipeline steps and returns a readable Stream for direct piping to HTTP responses or storage sinks.

```javascript
const readableStream = pipeline.toStream();
readableStream.pipe(res);
```

---

## 3. Registering Custom Presets

You can extend the pipeline's `.preset()` method by registering custom presets with `presetService`:

```javascript
const { presetService } = require('@studioframes/condense');

presetService.registerPreset('mobile-card', {
  image: {
    width: 480,
    fit: 'inside',
    format: 'webp',
    targetSsim: 0.92,
    method: 'balanced',
  },
  text: {
    method: 'extreme',
  },
});

// Now available across all pipelines:
const cardBuffer = await createPipeline(rawImage, 'image/jpeg')
  .preset('mobile-card')
  .toBuffer();
```
