# ⚡ Condense

A high-performance, completely stateless file optimization and minification engine for Node.js. Condense handles images, video, audio, and code natively in-memory (RAM) using Buffers and Streams, completely bypassing the local server disk.

It can be run as a standalone API server via CLI, mounted inside an existing Express application as a router, or used directly in your codebase via programmatic utility functions.

## Features
- **Zero Disk I/O:** Fully streaming and buffer-based architecture to minimize memory overhead.
- **Granular Bypass Rules:** Add `data-condense-ignore` to any HTML tag (or `/* condense-ignore */` in JS/CSS) to prevent minification on a per-element or per-file basis.
- **Multi-Format Pipeline:** 
  - Code & Markup: JS, CSS, JSON, HTML
  - Media: MP4, MP3, WAV
  - Images: JPG, PNG, WebP

## Prerequisites
Media optimization now bundles FFmpeg directly inside the package using `ffmpeg-static`, so you do not need to install `ffmpeg` globally for media workflows.

If you are running on an unusual platform not supported by `ffmpeg-static`, you may still need a system FFmpeg installed.

## Installation

```bash
npm install @studioframes/condense
```


## Usage

### Option A: Standalone CLI Server
Run a dedicated Condense microservice directly from your terminal:

```bash
npx @studioframes/condense
```
*Defaults to port `3000`. You can configure the port using the `PORT` environment variable:*
```bash
PORT=8080 npx @studioframes/condense
```

### Option B: Express Middleware / Sub-App
Mount Condense directly onto an existing Express application router:

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

### Option C: Programmatic Helper SDK
Import the low-level processing functions to optimize Buffers directly inside your codebase without HTTP routing:

```javascript
const { optimizeImage, optimizeText, optimizeMediaStream } = require('@studioframes/condense');

// 1. Optimize an Image Buffer (returns Buffer)
const { buffer: imgBuffer, outMime: imgMime } = await optimizeImage(rawImageBuffer, 'image/png', 'extreme');

// 2. Optimize an HTML / CSS / JS Buffer (returns Buffer)
const { buffer: textBuffer, outMime: textMime } = await optimizeText(rawHtmlBuffer, 'text/html', 'quality');

// 3. Optimize Audio / Video (returns PassThrough Stream)
const { stream, outMime: mediaMime } = optimizeMediaStream(rawVideoBuffer, 'video/mp4', 'quality');
```



## Granular Ignorance (Opt-Outs)

Condense supports local directives so that specific code segments are not modified during minification.

### In HTML Documents
Add the `data-condense-ignore` attribute to any tag (or the root `<html>` tag to ignore the whole file). Condense protects that tag and all its nested children:

```html
<!-- This div, the image, and the text will be returned exactly as-is -->
<div data-condense-ignore class="uncompressed-layout">
    <p>   Some formatted    text here.   </p>
    <img src="large-photo.jpg">
</div>

<!-- This will be compressed normally -->
<p>This paragraph gets minified.</p>
```

### In CSS & JavaScript
Add the `/* condense-ignore */` comment anywhere inside your JS or CSS file to bypass minification entirely:

```javascript
/* condense-ignore */
function legacyCode() {
    // This file will not be altered
    var x =   10; 
}
```

## API Endpoint Reference (For Options A & B)

### `POST /optimize`
Optimizes an uploaded file in-memory.

**Payload (Multipart Form-Data):**
- `file`: The binary file (Max 50MB)
- `method`: `quality` (visually lossless, default) or `extreme` (aggressive size reduction)

**Example Request:**
```bash
curl -X POST http://localhost:3000/v1/optimize \
  -F "file=@./photo.png" \
  -F "method=extreme" \
  --output photo-condensed.webp
```