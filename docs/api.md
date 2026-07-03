# API Guide

Condense exposes three main integration paths:

1. Programmatic helpers for direct use inside your application
2. A command-line interface for automation and batch work
3. An HTTP server or middleware layer for file uploads and API endpoints

## Programmatic API

The public helpers are exported from [src/index.js](../src/index.js). Common helpers include:

- optimizeText for HTML, CSS, JS, JSON, YAML, and similar text assets
- optimizeImage for raster and vector images
- optimizeMediaStream for audio and video streams
- extractVideoThumbnail for generating a thumbnail from a video stream
- optimizeEsbuild for TypeScript and JSX/TSX workflows
- optimizeWasm for WebAssembly optimization

Example:

```javascript
const { optimizeImage } = require('@studioframes/condense');

const { buffer, outMime } = await optimizeImage(rawBuffer, 'image/png', 'balanced');
```

## HTTP API

The built-in Express app exposes a POST /optimize endpoint and a GET /health endpoint.

### POST /optimize

Use a multipart form upload with a field named file. The request body can include:

- method: quality, balanced, or extreme
- width, height, fit for image resizing
- keepMetadata and keepFormat for image handling
- faststart, thumbnail for media processing

Example:

```bash
curl -X POST http://localhost:3000/optimize \
  -F "file=@./photo.png;type=image/png" \
  -F "method=balanced"
```

### GET /health

Returns basic process and memory diagnostics for monitoring and debugging.

## CLI API

The CLI entry point is [bin/cli.js](../bin/cli.js). Typical usage looks like this:

```bash
npx @studioframes/condense optimize ./src -o ./dist -m balanced
```

## Supported content types

Condense handles the major format families implemented in the service layer, including images, text, media, esbuild-based code, and WebAssembly.

## Notes on compatibility

- Ignore directives remain supported for selective bypassing
- Some operations, such as media streaming, are best handled through the HTTP or streaming APIs
- For production deployments, consider using caching and request timeouts as needed
