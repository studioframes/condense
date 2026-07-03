# Architecture Guide

Condense is structured around a small set of focused modules that keep the implementation reusable and easy to reason about. The design favors stateless processing, clear service boundaries, and minimal disk I/O.

## High-level request flow

1. A client interacts with the CLI, programmatic API, or HTTP interface.
2. The request reaches the appropriate entry point: a CLI command, the Express app, or a direct helper call.
3. The controller layer determines the content type and dispatches the processing request to a matching service.
4. The selected service transforms the input buffer or stream into optimized output.
5. The result is returned to the caller, optionally cached when the format supports it.

## Main layers

- Entry points: [src/index.js](../src/index.js), [bin/cli.js](../bin/cli.js), and [src/app.js](../src/app.js)
- Controller layer: [src/controllers/optimizeController.js](../src/controllers/optimizeController.js)
- Middleware layer: [src/middleware/upload.js](../src/middleware/upload.js)
- Service layer: [src/services](../src/services)
- Cache layer: [src/services/cacheService.js](../src/services/cacheService.js)

## Service responsibilities

- imageService handles image decoding, encoding, resizing, and format conversion
- textService handles HTML, CSS, JS, JSON, YAML, GraphQL, and similar text assets
- mediaService handles audio and video streams, thumbnails, and faststart processing
- esbuildService handles TypeScript, JSX, and TSX workflows
- wasmService handles WebAssembly-specific optimization
- cacheService provides optional in-memory caching for non-streaming formats

## Design principles

- Keep services focused and composable
- Avoid temporary files unless a workflow explicitly requires them
- Preserve a stateless model so each request can be processed independently
- Keep public exports stable for downstream integrations

## Why this structure helps

The current layout makes it straightforward to extend Condense with a new format or processing mode without introducing coupling to the HTTP layer or CLI layer.
