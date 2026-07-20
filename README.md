<div align="center">

[![logo](https://github.com/user-attachments/assets/7c1cebfa-f186-4dab-9dc1-fee7474a30dc)](https://condense.js.org)

[![npm](https://conbadges.pages.dev/api/npm/v/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![downloads](https://conbadges.pages.dev/api/npm/dt/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![License](https://conbadges.pages.dev/api/badge?label=license&value=Apache-2.0)](./LICENSE)

**[Condense](https://condense.js.org) is a high-performance, stateless file optimization and minification engine for [Node.js](https://nodejs.org). It optimizes images, audio, video, code, and WebAssembly entirely in-memory using Buffers and Streams, and avoids writing temporary files to disk.**

</div>

## Introduction

Condense provides fast, in-memory optimization for media, code, and binaries. It exists to offer low-latency, stateless processing for server-side and serverless environments where temporary disk I/O is undesirable or unavailable. Unlike traditional tools that rely on intermediate temporary files, Condense processes uploads and assets using Buffers and Streams, returning optimized Buffers or Streams ready to send in responses.

### Table of Contents
- <a href="#why-condense">Why Condense?</a>
- <a href="#features">Features</a>
- <a href="#supported-formats">Supported Formats</a>
- <a href="#installation">Installation</a>
- <a href="#quick-start">Quick Start</a>
- <a href="#usage">Usage</a>
- <a href="#ignore-directives">Ignore Directives</a>
- <a href="#api-reference-selected">API Reference</a>
- <a href="#benchmarks">Benchmarks</a>
- <a href="#system-requirements">System Requirements</a>
- <a href="#code-of-conduct">Code of Conduct</a>
- <a href="#contributing-to-condense">Contributing</a>
- <a href="#license">License</a>

## Why Condense?

- **No temporary files:** Processes files entirely in-memory using Buffers and Streams without writing temporary files to disk.
- **Stateless architecture:** Optimizations are performed per-request without persistent state, easing horizontal scaling.
- **API-friendly:** Designed to integrate cleanly into HTTP APIs and microservices.
- **Serverless-ready:** Works well in ephemeral environments (Cloud Functions, Lambda-like runtimes) where disk access is limited.
- **High-throughput:** Efficient pipelines suitable for high-volume media processing.
- **Low-latency:** Optimized for minimal added latency in request/response flows.

## Features
- In-memory Buffer & Stream processing (no temporary disk writes except when explicitly invoking `faststart`)
- Image (including AVIF & GIF), audio, video, code/markup (including SVG), and WebAssembly optimization
- Intelligent Dynamic Resizing via `width`, `height`, and `fit` API parameters
- Video Thumbnail Extraction and Standard MP4 Faststart utilities
- Express middleware and standalone CLI with beautiful terminal UI
- Ignore directives to opt-out specific regions or files from minification
- Built-in LRU Cache for frequently optimized static assets (enabled via `CONDENSE_CACHE=true`)
- System Health Diagnostics API (`/health`)

## Supported Formats

| Category | Formats |
| --- | --- |
| Images | `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`, `.svg` |
| Audio | `.mp3`, `.wav` |
| Video | `.mp4` |
| Web | `.html`, `.css`, `.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `.xml`, `.yaml`, `.yml`, `.graphql`, `.less`, `.scss` |

## Installation

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

## Usage

Condense can run as a standalone CLI tool, a server, be mounted as Express middleware, or be used programmatically.

## Documentation

The documentation set has been expanded and is now organized for both new users and contributors. The complete documentation is available on the [Condense Website](https://condense.js.org/docs)—which is rendered directly from the markdown files in this repository.

If you prefer to browse the source files directly here on GitHub, you can start with the docs hub in [docs/README.md](./docs/README.md).

### Quick Start Reference

* **CLI Optimization:**
  ```bash
  npx @studioframes/condense optimize ./src -o ./dist -m balanced
  ```
  See [COMMANDS.md](./COMMANDS.md) for full CLI documentation
  
* **Server:**
  ```bash
  npx @studioframes/condense
  ``` 
  defaults to port 3000; set `PORT` to override
  
* **Express:** mount `condenseApp` on a route to accept uploads
* **Programmatic:** use helpers such as `optimizeImage`, `optimizeText`, `optimizeMediaStream`, `optimizeEsbuild`, `optimizeWasm`

### Examples

#### CLI Usage

Condense v0.3.0 introduced a styled, fully-featured CLI:

* **Optimize a single image with extreme compression:**
  ```bash
  npx @studioframes/condense optimize photo.png -o out.webp --method extreme
  ```

* **Batch optimize a directory using the balanced method:**
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

#### Programmatic Helper SDK

```javascript
const { optimizeImage, optimizeText, optimizeMediaStream, optimizeEsbuild } = require('@studioframes/condense');

// 1. Optimize an Image Buffer (returns Buffer)
const { buffer: imgBuffer, outMime: imgMime } = await optimizeImage(rawImageBuffer, 'image/png', 'extreme');

// 2. Optimize an HTML / CSS / JS Buffer (returns Buffer)
const { buffer: textBuffer, outMime: textMime } = await optimizeText(rawHtmlBuffer, 'text/html', 'balanced');

// 3. Optimize Audio / Video (returns PassThrough Stream)
const { stream, outMime: mediaMime } = optimizeMediaStream(rawVideoBuffer, 'video/mp4', 'quality');

// 4. Optimize TypeScript/React (returns Buffer)
const { buffer: tsBuffer, outMime: tsMime } = await optimizeEsbuild(rawTsBuffer, '.tsx', 'quality');
```

## Optimization Methods

Condense provides three primary optimization targets:

- `quality` (Default): Visually lossless, safe compression, preserves maximum fidelity.
- `balanced`: A sweet spot between file size and quality. Introduces mild lossy compression (e.g. 65% quality for JPEGs, crf 26 for video).
- `extreme`: Maximum compression. Forces conversions to modern formats (e.g. JPEG/PNG to WebP/AVIF), drops console logs, strips WASM custom sections, downscales video.

## Ignore Directives

Use ignore directives to prevent minification for a file or a specific region.

- `html`: add `data-condense-ignore` to any element (or `<html>` to ignore the whole document).
- Code (`js`, `css`, `ts`, `jsx`, `tsx`, `less`, `scss`): add the comment `/* condense-ignore */` anywhere in the file to bypass minification.

### Examples

#### `html`

```html
<div data-condense-ignore>
  <pre>
    Preserved spacing and content here
  </pre>
</div>
```

#### `js`/`ts`

```javascript
/* condense-ignore */
function legacyCode() {
    // This file will not be altered
    var x =   10; 
}
```

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

Below are the benchmark results of processing our sample suite through the `Condense` pipeline using the `quality`, `balanced` and `extreme` methods. See [`demo`](https://github.com/studioframes/Condense/tree/main/demo) directory to learn more.

| File Name | Original Size | Quality Size | Balanced Size | Extreme Size | Max Reduction |
| --- | --- | --- | --- | --- | --- |
| `styles.scss` | 1.3 KB | 0.3 KB | 0.3 KB | 0.3 KB | -76.2% |
| `demo.png` | 115.3 KB | 98.9 KB | 30.2 KB | 26.7 KB | -76.8% |
| `app.js` | 5.0 KB | 1.8 KB | 1.8 KB| 1.4 KB | -72.5% |
| `component.tsx` | 2.6 KB | 1.8 KB | 1.1 KB | 1.0 KB | -61.0% |
| `service.ts` | 2.2 KB | 1.5 KB | 1.0 KB | 0.9 KB | -58.0% |
| `view.jsx` | 2.3 KB | 1.8 KB | 1.2 KB | 1.1 KB | -52.2% |
| `demo.svg` | 217.0 KB | 119.5 KB | 119.3 KB | 119.3 KB | -45.0% |
| `styles.css` | 1.0 KB | 0.7 KB | 0.6 KB | 0.6 KB | -36.4% |
| `index.html` | 2.4 KB | 1.6 KB | 1.6 KB | 1.5 KB | -35.9% |
| `config.yml` | 0.9 KB | 0.7 KB | 0.7 KB | 0.6 KB | -30.0% |
| `data.json` | 0.5 KB | 0.4 KB | 0.4 KB | 0.4 KB | -25.7% |
| `demo.mp4` | 30.8 KB | 31.6 KB | 29.4 KB| 25.8 KB | -16.4% |

## System Requirements

- Minimum Node.js: >= 20.9

## Code of Conduct

We expect all project participants to adhere to our newly established, repository-specific code of conduct. Please read [the full text](https://github.com/studioframes/Condense/blob/main/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Contributing to Condense

We welcome contributions from everyone. Read our [contributing guide](https://github.com/studioframes/Condense/blob/main/CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Condense.

## License

This project is managed by Studio Frames and is licensed under the Apache License 2.0. See [LICENSE](https://github.com/studioframes/Condense/blob/main/LICENSE) for the full text.
