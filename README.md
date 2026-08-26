[![logo](https://github.com/user-attachments/assets/63c325d3-7511-4f56-8642-e40eab63ffd2)](https://condense.js.org)

[![npm](https://conbadges.pages.dev/api/npm/v/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![downloads](https://conbadges.pages.dev/api/npm/dt/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![License](https://conbadges.pages.dev/api/badge?label=license&value=Apache-2.0)](./LICENSE)

**The fast, all-in-one, stateless file optimization engine.**

## Introduction

Condense provides fast, in-memory optimization for media, code, and binaries. It exists to offer low-latency, stateless processing for server-side and serverless environments where temporary disk I/O is undesirable or unavailable. Unlike traditional tools that rely on intermediate temporary files, Condense processes uploads and assets using Buffers and Streams, returning optimized Buffers or Streams ready to send in responses.

## Install

Install with your preferred package manager:

#### npm

```bash
npm i @studioframes/condense
```

#### yarn

```bash
yarn add @studioframes/condense
```

#### pnpm

```bash
pnpm add @studioframes/condense
```

#### bun

```bash
bun add @studioframes/condense
```

### System Requirements

- **Node.js** ≥ 20.9.0
- **Memory** ~50MB base + file size
- **CPU** Single-threaded by default; multi-threaded worker pool supported via `WorkerPool`
- **OS** Linux/macOS/Windows

## Quick Links

**External Resources:**
- [Website](https://condense.js.org)
- [Docs](https://condense.js.org/docs)
- [Changelog](https://condense.js.org/changelog)
- [npm](https://www.npmjs.com/package/@studioframes/condense)

**Internal Resources:**
- [Docs](./docs/README.md)
- [Changelog](./CHANGELOG.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Commands](./COMMANDS.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Dependencies](./DEPENDENCIES.md)
- [License](./LICENSE)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Roadmap](./ROADMAP.md)
- [Security](./SECURITY.md)

**Table of Contents:**
- [Introduction](#introduction)
- [Install](#install)
  - [System Requirements](#system-requirements)
- [Why Condense?](#why-condense)
- [Features](#features)
  - [In-Memory Processing](#in-memory-processing)
  - [Fluent Pipeline API](#fluent-pipeline-api)
  - [Perceptual Image Compression (SSIM/PSNR)](#perceptual-image-compression)
  - [Enterprise Binary & Archive Optimization](#enterprise-binary--archive-optimization)
  - [Cross-Document Token Mangling](#cross-document-token-mangling)
  - [Multi-Threaded Worker Pool](#multi-threaded-worker-pool)
  - [Enterprise Telemetry & ROI](#enterprise-telemetry--roi)
  - [Comprehensive Format Support](#comprehensive-format-support)
  - [Smart Ignore Directives](#smart-ignore-directives)
  - [Optional LRU Caching](#optional-lru-caching)
- [Quick Start](#quick-start)
- [Use Cases](#use-cases)
- [Usage](#usage)
  - [Fluent Pipeline](#fluent-pipeline)
  - [Perceptual Tuning](#perceptual-tuning)
  - [SVG Spritesheets](#svg-spritesheets)
  - [ZIP Archives](#zip-archives)
  - [Express Middleware](#express-middleware)
  - [CLI Usage](#cli-usage)
- [Optimization Methods](#optimization-methods)
- [API Reference](#api-reference-selected)
- [Benchmarks](#benchmarks)
- [Documentation](#documentation)
- [Contributing](#contributing-to-condense)
- [License](#license)

## Why Condense?

| Feature | Condense | ImageMin | FFmpeg | Sharp | Terser |
|---------|:---:|:---:|:---:|:---:|:---:|
| **In-memory processing** | ✅ | ❌ | ❌ | 🔹 | ✅ |
| **No temp files** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Images + Media + Code + WASM** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Express middleware** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Serverless-ready** | ✅ | ❌ | ❌ | 🔹 | ✅ |

**Bottom line:** Condense is 2-5x faster than tools that write temporary files to disk.

More over, Condense is/has:

- **API-friendly:** Designed to integrate cleanly into HTTP APIs and microservices.
- **High-throughput:** Efficient pipelines suitable for high-volume media processing.
- **Low-latency:** Optimized for minimal added latency in request/response flows.

## Features

### In-Memory Processing
Zero temporary disk writes by default. Condense processes files entirely using Buffers and Streams, returning optimized data ready to transmit in HTTP responses or save directly to object storage.

### Fluent Pipeline API
Chain complex multi-step transformations with an intuitive builder interface:

```javascript
const { createPipeline } = require('@studioframes/condense');

const resultBuffer = await createPipeline(rawBuffer, 'image/jpeg')
  .preset('web-hero')
  .toBuffer();
```

### Perceptual Image Compression (SSIM / PSNR)
Binary search optimizer targeting mathematically verifiable structural similarity (SSIM) and peak signal-to-noise ratio (PSNR) to maximize byte savings while preserving visual fidelity:

```javascript
const { optimizePerceptualImage } = require('@studioframes/condense');

const { buffer, ssim, finalQuality } = await optimizePerceptualImage(buffer, 'image/jpeg', {
  targetSsim: 0.95,
  format: 'webp',
});
```

### Enterprise Binary & Archive Optimization
- **ZIP Archives (`optimizeZip`)**: In-memory recursive decompression, multi-format asset optimization, and maximum DEFLATE repacking.
- **SVG Spritesheet Packer (`packSvgSprites`)**: Consolidates separate SVG icons into a unified `<symbol>` sheet.
- **Font Table Stripper (`optimizeFont`)**: Drops redundant metadata tables (`DSIG`, `hdmx`, `LTSH`, `PCLT`) from TTF/OTF/WOFF binaries.
- **PDF Compression (`optimizePdf`)**: In-memory comment stripping and stream minification.

### Cross-Document Token Mangling
Coordinately shorten CSS class names and element IDs across interconnected HTML, CSS, and JavaScript files (`mangleTokens`).

### Multi-Threaded Worker Pool
Offload CPU-intensive compression jobs to background `worker_threads` with automatic thread pooling and main-thread fallback (`WorkerPool`, `getWorkerPool`).

### Enterprise Telemetry & ROI
Real-time tracking of total processed files, bandwidth saved, estimated financial cost reduction ($USD), and carbon savings ($\text{gCO}_2$).

### Comprehensive Format Support
Optimize images (PNG, JPEG, WebP, AVIF, GIF, SVG), audio/video (MP3, WAV, MP4), code/markup (HTML, CSS, JS, TS, JSX, TSX, JSON, XML, YAML, GraphQL, SCSS, LESS), fonts, PDFs, and WebAssembly binaries.

### Smart Ignore Directives

Use ignore directives to prevent minification for a file or a specific region:

- `html`: add `data-condense-ignore` to any element (or `<html>` to ignore the whole document).
- Code (`js`, `css`, `ts`, `jsx`, `tsx`, `less`, `scss`): add `/* condense-ignore */` anywhere in the file to bypass minification.

### Optional LRU Caching
Enable built-in LRU cache to avoid re-processing frequently requested assets via `CONDENSE_CACHE=true`.

## Quick Start

The simplest in-process example — optimize an image Buffer and get back an optimized Buffer:

```javascript
const { optimizeImage } = require('@studioframes/condense');

async function simpleOptimize(rawBuffer) {
  const { buffer: optimized, outMime } = await optimizeImage(rawBuffer, 'image/png', 'quality');
  // send `optimized` as the HTTP response body with Content-Type `outMime`
  return { optimized, outMime };
}

// Usage: pass a Buffer (e.g., from file upload or fetch response)
```

## Use Cases

### Web APIs
Optimize user uploads before storage. Compress images, videos, and documents on-the-fly without temporary files. One optimization, many output formats. Perfect for file-sharing platforms, photo galleries, and document management systems.

```javascript
// Example: Express API endpoint for image uploads
app.post('/api/upload', multer().single('image'), async (req, res) => {
  const { buffer: optimized, outMime } = await optimizeImage(
    req.file.buffer,
    req.file.mimetype,
    'balanced'
  );
  
  // Save directly to S3 or database
  await storage.save(optimized, outMime);
  res.json({ size: optimized.length });
});
```

### Serverless Functions
AWS Lambda, Google Cloud Functions, Azure Functions. No disk I/O limits, pure in-memory processing. Handle file optimization within function timeout constraints. Scales automatically with demand—pay only for what you use.

```javascript
// Example: AWS Lambda handler
exports.optimizeImage = async (event) => {
  const buffer = Buffer.from(event.body, 'base64');
  const { buffer: optimized } = await optimizeImage(buffer, 'image/jpeg', 'balanced');
  
  return {
    statusCode: 200,
    body: optimized.toString('base64'),
    headers: { 'Content-Type': 'image/webp' }
  };
};
```

### Build Tools
Optimize assets at build time with the CLI. Batch processing with beautiful TUI. Integrate into your build pipeline (Webpack, Vite, Rollup) for automated asset compression. Reduce bundle sizes by 50-80%.

```bash
# Batch optimize entire directories
npx @studioframes/condense optimize ./src/assets -o ./dist --method balanced

# Watch mode for development
npx @studioframes/condense optimize ./src -o ./dist --watch
```

### Media Platforms
Real-time image/video resizing and compression for multiple screen sizes and devices. Generate thumbnails, create responsive image sets, and optimize video for streaming. Essential for YouTube-like platforms and content CDNs.

```javascript
// Example: Generate responsive image set
const sizes = [320, 768, 1024, 1920];
const variants = await Promise.all(sizes.map(width =>
  optimizeImage(buffer, 'image/jpeg', 'balanced', { width, fit: 'cover' })
));
```

### Edge Runtimes
Cloudflare Workers, Vercel Edge Functions, and similar edge computing platforms. Lightweight, stateless optimization at the edge for ultra-low latency. Process and serve optimized content from locations nearest to users.

```javascript
// Example: Cloudflare Worker
export default {
  async fetch(request) {
    const image = await request.arrayBuffer();
    const { buffer: optimized } = await optimizeImage(image, 'image/png', 'extreme');
    return new Response(optimized, { headers: { 'Content-Type': 'image/webp' } });
  }
};
```

## Usage

Condense can run as a standalone CLI tool, a server, be mounted as Express middleware, or be used programmatically.

### Quick Start Reference

- **CLI Optimization:**

  ```bash
  npx @studioframes/condense optimize ./src -o ./dist -m balanced
  ```

  See [COMMANDS.md](./COMMANDS.md) for full CLI documentation

- **Server:**

  ```bash
  npx @studioframes/condense
  ```

  defaults to port 3000; set `PORT` to override

- **Express:** mount `condenseApp` on a route to accept uploads
- **Programmatic:** use helpers such as `optimizeImage`, `optimizeText`, `optimizeMediaStream`, `optimizeEsbuild`, `optimizeWasm`

### Environment Variables

```bash
CONDENSE_MODE=balanced           # quality, balanced, or extreme
CONDENSE_CACHE=true              # Enable LRU cache
CONDENSE_CACHE_SIZE=100          # Cache entries
CONDENSE_MAX_SIZE=104857600      # Max file size (100MB default)
CONDENSE_TIMEOUT=30000           # Timeout in ms
```

### Examples

#### CLI Usage

Condense has a styled, fully-featured CLI:

- **Optimize a single image with extreme compression:**

  ```bash
  npx @studioframes/condense optimize photo.png -o out.webp --method extreme
  ```

- **Batch optimize a directory using the balanced method:**
  ```bash
  npx @studioframes/condense optimize ./src/ -o ./dist/ --method balanced
  ```

#### Express Middleware

```javascript
const express = require('express');
const { condenseApp } = require('@studioframes/condense');

const app = express();

// Mount all optimization routes under a specific path
app.use('/v1', condenseApp);

app.listen(8080, () => {
  console.log('App running. POST files to http://localhost:8080/v1/optimize');
});
```

#### Programmatic Helper SDK & Fluent Pipeline

```javascript
const {
  createPipeline,
  optimizePerceptualImage,
  packSvgSprites,
  optimizeZip,
  optimizeFont,
  optimizeImage,
  optimizeText,
  optimizeMediaStream,
  optimizeEsbuild,
} = require('@studioframes/condense');

// 1. Fluent Chainable Pipeline
const condensedBuffer = await createPipeline(rawImageBuffer, 'image/jpeg')
  .preset('web-hero')
  .toBuffer();

// 2. Perceptual Image Optimizer (Binary-search SSIM)
const { buffer: webpBuf, ssim, finalQuality } = await optimizePerceptualImage(
  rawImageBuffer,
  'image/jpeg',
  { targetSsim: 0.95, format: 'webp' }
);

// 3. In-Memory SVG Spritesheet Packing
const spritesheet = packSvgSprites([
  { id: 'icon-home', content: '<svg viewBox="0 0 24 24"><path d="..."/></svg>' },
  { id: 'icon-user', content: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/></svg>' }
]);

// 4. In-Memory Recursive ZIP Archive Optimizer
const { buffer: zipBuf, processedFiles } = await optimizeZip(rawZipBuffer, { method: 'extreme' });

// 5. SFNT / WOFF Font Table Stripper
const { buffer: fontBuf, droppedTables } = await optimizeFont(rawFontBuffer, 'font/ttf');

// 6. Direct Buffer / Stream Optimization
const { buffer: imgBuffer } = await optimizeImage(rawImageBuffer, 'image/png', 'balanced');
const { stream: mediaStream } = optimizeMediaStream(rawVideoBuffer, 'video/mp4', 'quality');
```

## Optimization Methods

Condense provides three primary optimization targets:

- `quality` (Default): Visually lossless, safe compression, preserves maximum fidelity.
- `balanced`: A sweet spot between file size and quality. Introduces mild lossy compression (e.g. 65% quality for JPEGs, crf 26 for video).
- `extreme`: Maximum compression. Forces conversions to modern formats (e.g. JPEG/PNG to WebP/AVIF), drops console logs, strips WASM custom sections, downscales video.

## API Reference (selected)

POST `/optimize`

- Multipart form: `file` (binary), `method` (`quality` | `balanced` | `extreme`)
- Optional form/query params: `width`, `height`, `fit`, `keepMetadata`, `keepFormat`, `targetFormat`, `faststart`, `thumbnail`.
- Returns optimized binary in the response body with appropriate `Content-Type`.

### Example Request:

```bash
curl -X POST http://localhost:3000/optimize \
  -F "file=@./photo.png;type=image/png" \
  -F "method=balanced" \
  --output photo-condensed.png
```

Short explanation: uploads are received into memory (Buffers or Streams), processed by Condense in-memory, optionally cached in LRU cache, and returned as an optimized Buffer or Stream without intermediate disk writes.

## Benchmarks

Below are the benchmark results of processing our sample suite through the `Condense` pipeline using the `quality`, `balanced` and `extreme` methods on demo files (Node.js v24, 2-core CPU). See [`demo`](https://github.com/studioframes/Condense/tree/main/demo) directory to learn more.

| File Name       | Original | Quality | Balanced | Extreme | Max Reduction | Time (Q/B/E) |
| --------------- | --------- | -------- | --------- | --------- | ------------- | ------------ |
| `demo.png`      | 115.3 KB  | 98.9 KB  | 30.2 KB   | 26.7 KB   | -76.8%        | 35/95/122ms |
| `app.js`        | 5.0 KB    | 1.8 KB   | 1.8 KB    | 1.4 KB    | -72.5%        | 27/4/5ms |
| `component.tsx` | 2.6 KB    | 1.8 KB   | 1.1 KB    | 1.0 KB    | -61.0%        | — |
| `service.ts`    | 2.2 KB    | 1.5 KB   | 1.0 KB    | 0.9 KB    | -58.0%        | — |
| `view.jsx`      | 2.3 KB    | 1.8 KB   | 1.2 KB    | 1.1 KB    | -52.2%        | — |
| `demo.svg`      | 217.0 KB  | 119.5 KB | 119.3 KB  | 119.3 KB  | -45.0%        | — |
| `styles.css`    | 1.0 KB    | 0.7 KB   | 0.6 KB    | 0.6 KB    | -36.4%        | 22/11/3ms |
| `index.html`    | 2.4 KB    | 1.6 KB   | 1.6 KB    | 1.5 KB    | -35.9%        | 48/7/8ms |
| `config.yml`    | 0.9 KB    | 0.7 KB   | 0.7 KB    | 0.6 KB    | -30.0%        | — |
| `data.json`     | 0.5 KB    | 0.4 KB   | 0.4 KB    | 0.4 KB    | -25.7%        | <1ms |
| `demo.mp4`      | 30.8 KB   | 31.6 KB  | 29.4 KB   | 25.8 KB   | -16.4%        | — |

### Performance vs Competitors

| Task | Condense | ImageMin | Sharp | Terser | FFmpeg |
|------|----------|----------|-------|--------|--------|
| PNG (115 KB) | **94ms** | 300ms | 180ms | — | 1000ms |
| JS (5 KB) | **4ms** | — | — | 75ms | — |
| HTML (2.4 KB) | **7ms** | — | — | 100ms | — |

## Documentation

The documentation set has been expanded and is now organized for both new users and contributors. The complete documentation is available on the [Condense Website](https://condense.js.org/docs)—which is rendered directly from the markdown files in this repository.

If you prefer to browse the source files directly here on GitHub, you can start with the docs hub in [docs/README.md](./docs/README.md).

## Code of Conduct

We expect all project participants to adhere to our newly established, repository-specific code of conduct. Please read [the full text](https://github.com/studioframes/Condense/blob/main/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Contributing to Condense

We welcome contributions from everyone. Read our [contributing guide](https://github.com/studioframes/Condense/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Condense.

## License

This project is managed by Studio Frames and is licensed under the Apache License 2.0. See [LICENSE](https://github.com/studioframes/Condense/blob/main/LICENSE) for the full text.
