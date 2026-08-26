# Architecture Guide

Condense is designed around a modular, stateless, and in-memory execution model. It avoids temporary disk writes and separates concerns into clear, decoupled service modules.

## Architectural Diagram

```
                             ┌─────────────────────────────────────────────────────┐
                             │                  Entry Points                       │
                             │  - Programmatic SDK (`index.js`)                    │
                             │  - Fluent Pipeline API (`createPipeline`)           │
                             │  - Multi-Threaded Worker Pool (`workerPool.js`)     │
                             │  - Standalone CLI (`bin/cli.js`)                    │
                             │  - Express Router / Microservice (`app.js`)         │
                             └──────────────────────────┬──────────────────────────┘
                                                        │
                             ┌──────────────────────────▼──────────────────────────┐
                             │             Controller & Dispatcher                 │
                             │  - MIME detection & Preset matching                 │
                             │  - Caching layer (`cacheService.js`)                │
                             │  - Telemetry interception (`telemetryService.js`)   │
                             └──────────────────────────┬──────────────────────────┘
                                                        │
          ┌─────────────────────┬───────────────────────┼───────────────────────┬─────────────────────┐
          │                     │                       │                       │                     │
┌─────────▼─────────┐ ┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐ ┌─────────▼─────────┐
│   Image Services  │ │   Text & Code     │   │   Media Services  │   │  Binary & Fonts   │ │   WASM & Archive    │
│ - sharp           │ │ - html-minifier   │   │ - ffmpeg streams  │   │ - fontService     │ │ - wasmService       │
│ - ssimService     │ │ - clean-css       │   │ - faststart       │   │ - pdfService      │ │ - archiveService    │
│ - responsiveMatrix│ │ - terser          │   │ - thumbnails      │   │ - svgSpriteService│ │   (fflate in RAM)   │
│                   │ │ - esbuildService  │   │                   │   │                   │ │                   │
│                   │ │ - tokenMangling   │   │                   │   │                   │ │                   │
└───────────────────┘ └───────────────────┘   └───────────────────┘   └───────────────────┘ └───────────────────┘
```

## Service Responsibilities

- **`imageService` / `ssimService`**: Image decoding, format conversions (AVIF, WebP, JPEG, PNG, GIF), dynamic resizing, and perceptual SSIM binary-search quality tuning.
- **`textService` / `esbuildService`**: Minifies HTML, CSS, JavaScript, TypeScript, JSX/TSX, JSON, YAML, SCSS, LESS, and GraphQL while preserving ignore directives (`data-condense-ignore`, `/* condense-ignore */`).
- **`tokenManglingService`**: Coordinates shortening of CSS class names and DOM element IDs across interconnected HTML/CSS/JS files.
- **`svgSpriteService`**: Consolidates separate SVG icons into an optimized `<svg><defs><symbol>` spritesheet.
- **`archiveService`**: Pure in-memory ZIP archive decompression, recursive internal asset optimization, and DEFLATE recompression.
- **`fontService`**: SFNT & WOFF metadata table stripping (`DSIG`, `hdmx`, `LTSH`, `PCLT`) with directory checksum recalculation.
- **`pdfService`**: In-memory PDF minification, comment stripping, and text stream recompression.
- **`mediaService`**: Video and audio transcoding, thumbnail generation, and MP4 faststart stream preparation.
- **`workerPool`**: Spawns and manages Node.js `worker_threads` for non-blocking parallel execution on multi-core systems.
- **`pipelineService`**: Fluent chainable builder pattern coordinating multi-step transformations.
- **`presetService`**: Pre-configured recipes and custom configuration registry.
- **`telemetryService`**: Real-time aggregation of processed assets, saved bytes, dollar cost reduction, and carbon savings.

## Key Architectural Principles

1. **Pure In-Memory Processing**: Zero temporary disk writes (`/tmp`) by default to ensure maximum speed, security, and compatibility with read-only serverless environments.
2. **Decoupled Business Logic**: Services consume and return pure Buffers or Streams, remaining agnostic of HTTP requests or CLI options.
3. **Stateless Scalability**: Every optimization operation is independent, enabling trivial horizontal scaling across container instances.

