# API Reference

Condense v1.0.0 provides three versatile integration surfaces:
1. **Programmatic SDK & Fluent Pipelines** for deep application logic.
2. **Worker Pool** for high-throughput multi-threaded batch operations.
3. **HTTP Server & Middleware** for network microservices and Express applications.
4. **CLI** for terminal-based and build-script asset processing.

---

## 1. Programmatic SDK Exports

Import helpers directly from `@studioframes/condense`:

```javascript
const {
  createPipeline,
  WorkerPool,
  getWorkerPool,
  optimizePerceptualImage,
  generateResponsiveMatrix,
  packSvgSprites,
  optimizeZip,
  optimizeFont,
  optimizePdf,
  mangleTokens,
  optimizeImage,
  optimizeText,
  optimizeMediaStream,
  extractVideoThumbnail,
  optimizeEsbuild,
  optimizeWasm,
  presetService,
  telemetryService,
  condenseApp,
} = require('@studioframes/condense');
```

---

### Fluent Pipeline: `createPipeline(input, mimeType)`
Constructs a chainable processing pipeline for an input Buffer or string.

**Methods:**
- `.preset(presetName)`: Applies a pre-configured recipe (e.g. `'web-hero'`, `'avatar-thumbnail'`, `'production-bundle'`).
- `.resize({ width, height, fit })`: Resizes image assets.
- `.perceptual({ targetSsim, targetPsnr, format })`: Runs binary search perceptual optimization.
- `.minify(options)`: Minifies text/code assets.
- `.toBuffer()`: Executes pipeline and returns a `Promise<Buffer>`.
- `.toStream()`: Executes pipeline and returns a readable Stream.

```javascript
const buffer = await createPipeline(rawImage, 'image/jpeg')
  .preset('web-hero')
  .toBuffer();
```

---

### Perceptual Image Optimizer: `optimizePerceptualImage(buffer, mimeType, options)`
Optimizes an image via binary search against SSIM/PSNR mathematical thresholds.

**Parameters:**
- `buffer` (Buffer): Source image data.
- `mimeType` (string): Input MIME (e.g., `'image/jpeg'`, `'image/png'`).
- `options` (object):
  - `targetSsim` (number, default: `0.95`): SSIM index target (0.0 to 1.0).
  - `targetPsnr` (number, optional): Minimum PSNR threshold in dB.
  - `format` (string, optional): Target format (`'webp'`, `'avif'`, `'jpeg'`, `'png'`).
  - `maxIterations` (number, default: `6`): Binary search iterations.

**Returns:** `Promise<{ buffer: Buffer, ssim: number, psnr: number, finalQuality: number, outMime: string }>`

---

### Responsive Matrix: `generateResponsiveMatrix(buffer, mimeType, options)`
Generates multi-resolution variants across standard breakpoints and modern formats (WebP/AVIF).

**Parameters:**
- `buffer` (Buffer): Input image buffer.
- `mimeType` (string): Input MIME type.
- `options` (object):
  - `widths` (number[], default: `[320, 640, 1024, 1920]`): Breakpoint widths.
  - `formats` (string[], default: `['avif', 'webp']`): Output formats.
  - `method` (string): `'quality'`, `'balanced'`, or `'extreme'`.

**Returns:** `Promise<{ variants: Array<{ width, format, buffer, byteLength }>, html: string }>`

---

### In-Memory SVG Sprites: `packSvgSprites(svgItems, options)`
Packs an array of individual SVG strings or buffers into a consolidated `<svg><defs><symbol>` spritesheet.

**Parameters:**
- `svgItems` (Array<{ id: string, content: string|Buffer }>): List of icons.
- `options` (object, optional): Configuration for SVGO minification.

**Returns:** `string` (The combined SVG spritesheet markup).

---

### In-Memory ZIP Optimizer: `optimizeZip(zipBuffer, options)`
Recursively decompresses, optimizes internal assets (images, text, fonts, binaries), and repacks the ZIP in memory.

**Parameters:**
- `zipBuffer` (Buffer): Input ZIP archive.
- `options` (object):
  - `method` (string): `'quality'`, `'balanced'`, or `'extreme'`.
  - `level` (number, default: `9`): DEFLATE compression level.

**Returns:** `Promise<{ buffer: Buffer, originalSize: number, optimizedSize: number, processedFiles: number }>`

---

### Font Table Stripper: `optimizeFont(fontBuffer, mimeType, options)`
Strips non-essential metadata tables from TrueType and OpenType font binaries.

**Parameters:**
- `fontBuffer` (Buffer): Font binary data.
- `mimeType` (string): `'font/ttf'`, `'font/otf'`, `'font/woff'`.
- `options` (object):
  - `tablesToDrop` (string[], default: `['DSIG', 'hdmx', 'LTSH', 'PCLT']`).

**Returns:** `Promise<{ buffer: Buffer, droppedTables: string[], byteLength: number }>`

---

### Cross-Document Token Mangling: `mangleTokens({ html, css, js }, options)`
Coordinately minifies class names and IDs across interdependent HTML, CSS, and JS.

**Parameters:**
- `{ html?: string, css?: string, js?: string }`
- `options` (object):
  - `prefix` (string, default: `'_'`): Prefix for generated tokens.
  - `reserved` (string[]): Tokens that should not be renamed.

**Returns:** `{ html?: string, css?: string, js?: string, tokenMap: Record<string, string> }`

---

## 2. Multi-Threaded Worker Pool

For CPU-intensive batch jobs, offload work to background `worker_threads`:

```javascript
const { getWorkerPool } = require('@studioframes/condense');

const pool = getWorkerPool({ maxWorkers: 4 });
const result = await pool.execute('optimizeImage', {
  buffer: rawBuffer,
  mimeType: 'image/png',
  method: 'balanced',
});
```

---

## 3. HTTP Endpoints

Condense runs as an Express router or standalone microservice.

### `POST /optimize`
Accepts a multipart file upload (`file` field).

**Form parameters:**
- `method`: `'quality'`, `'balanced'`, `'extreme'`
- `width`, `height`, `fit`: Optional image dimensions
- `targetSsim`: Perceptual SSIM target (e.g. `0.95`)
- `preset`: Pre-configured optimization recipe name
- `faststart`: MP4 faststart streaming flag
- `thumbnail`: Video thumbnail extraction flag

### `GET /health`
Returns process status, uptime, and system memory diagnostics.

---

## 4. Presets & Telemetry

### Presets
Built-in recipes: `web-hero`, `avatar-thumbnail`, `production-bundle`, `ultra-archive`, `email-safe`, `social-share`.

Register custom presets:
```javascript
presetService.registerPreset('my-recipe', {
  image: { method: 'extreme', format: 'webp', targetSsim: 0.92 },
  text: { method: 'extreme' },
});
```

### Telemetry
Track bandwidth savings and estimated financial ROI in real time:

```javascript
const stats = telemetryService.getMetrics();
console.log(`Saved ${stats.totalSavedBytesFormatted} ($${stats.estimatedCostSavingsUsd})`);
```

