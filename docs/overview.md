# Overview

Condense is a high-performance, stateless Node.js optimization engine for images, media, code, WebAssembly, fonts, and binary archives. Designed from first principles to operate entirely in-memory, Condense eliminates temporary disk I/O and easily integrates into high-throughput web services, serverless microservices, containers, and edge runtimes.

## Supported Asset Formats

Condense provides specialized optimization pipelines for:

- **Raster & Vector Images:** PNG, JPEG, WebP, AVIF, GIF, and SVG with perceptual SSIM/PSNR tuning and responsive ladder generation.
- **SVG Sprites:** In-memory batch packing into consolidated `<symbol>` spritesheets.
- **Audio & Video Streams:** MP4, MP3, WAV, OGG with direct stream piping, thumbnail extraction, and faststart support.
- **Code & Modern Text:** HTML, CSS, JavaScript, TypeScript, JSX/TSX (via `esbuild`), JSON, YAML, GraphQL, SCSS, LESS, and cross-document coordinated token mangling.
- **OpenType / TrueType Fonts:** SFNT & WOFF metadata table stripping (`DSIG`, `hdmx`, `LTSH`, `PCLT`).
- **PDF Documents:** In-memory comment stripping, metadata removal, and text/stream recompression.
- **ZIP Archives:** Pure in-memory recursive decompression, asset optimization, and maximum-ratio repacking with `fflate`.
- **WebAssembly:** Custom section and debug symbol stripping for `.wasm` binaries.

## Architectural Pillars (v1.0.0)

1. **Pillar 1: Next-Gen Intelligence & Perceptual Compression**
   - Perceptual image optimization (`optimizePerceptualImage`) via binary-search SSIM/PSNR targeting.
   - Responsive multi-breakpoint image matrix generation with `<picture>` markup helpers (`generateResponsiveMatrix`).
   - Cross-document HTML/CSS/JS token shortening (`mangleTokens`).

2. **Pillar 2: Enterprise Binary & Asset Processors**
   - In-memory SVG spritesheet consolidation (`packSvgSprites`).
   - In-memory recursive ZIP archive compression (`optimizeZip`).
   - SFNT & WOFF font table stripping (`optimizeFont`).
   - In-memory PDF minification (`optimizePdf`).

3. **Pillar 3: Developer Platform & Enterprise Telemetry**
   - Fluent Chainable Pipeline API (`createPipeline`).
   - Multi-threaded Worker Pool leveraging Node `worker_threads` (`WorkerPool`, `getWorkerPool`).
   - Production preset management engine (`presetService`).
   - Real-time bandwidth, financial ROI, and carbon savings tracking (`telemetryService`).

## Optimization Modes

- **quality:** Best perceptual fidelity with visually lossless, conservative compression.
- **balanced:** Practical sweet spot for production environments balancing speed, size, and fidelity.
- **extreme:** Maximum compression prioritizing file size reduction with aggressive transformations.

## Entry Points

- `src/index.js`: Comprehensive public SDK, fluent pipeline, and Express middleware exports.
- `bin/cli.js`: Standalone CLI for single-file, batch directory, and server execution.
- `src/app.js`: Stateless HTTP Express application.

