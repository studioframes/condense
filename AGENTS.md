# Condense Agents Instructions

## Project overview

Condense is a high-performance, stateless optimization engine for images, media, code, WebAssembly, fonts, and binary archives for Node.js. It is designed to be completely in-memory, with zero temporary disk writes by default.

## Repository layout

- `src/`: main implementation and public API
  - `src/index.js`: package exports and public entry points
  - `src/index.d.ts`: TypeScript type definitions for SDK and pipelines
  - `src/app.js`: Express app wiring and HTTP routes
  - `src/controllers/`: request handling and upload dispatch logic
  - `src/middleware/`: upload and request processing middleware
  - `src/services/`: optimization helpers:
    - `imageService.js` / `ssimService.js`: image compression, dynamic resizing, SSIM/PSNR perceptual tuning, responsive matrix
    - `textService.js` / `esbuildService.js`: code & markup minification (HTML, CSS, JS, TS, JSX, JSON, YAML, SCSS, LESS, GraphQL)
    - `tokenManglingService.js`: cross-document HTML/CSS/JS token shortening
    - `svgSpriteService.js`: SVG icon `<symbol>` spritesheet packing
    - `archiveService.js`: in-memory recursive ZIP decompression, asset optimization, and DEFLATE repacking
    - `fontService.js`: SFNT and WOFF OpenType font metadata table stripping
    - `pdfService.js`: in-memory PDF comment and stream compression
    - `mediaService.js`: FFmpeg streaming, faststart, and thumbnail extraction
    - `wasmService.js`: WebAssembly binary section stripping
    - `workerPool.js`: multi-threaded `worker_threads` pool with main-thread fallback
    - `pipelineService.js`: fluent chainable builder API (`createPipeline`)
    - `presetService.js`: built-in recipes and custom preset registry
    - `telemetryService.js`: real-time byte savings, financial ROI, and carbon tracking
    - `cacheService.js`: in-memory LRU caching
- `bin/`: CLI entry points (`bin/cli.js`, `bin/commands.js`, `bin/ui.js`)
- `tests/`: Node.js / Bun test suite (`node --test`)
- `demo/`: example assets and sample outputs
- `examples/`: small usage examples for CLI, middleware, and SDK usage
- `docs/`: comprehensive Condense documentation

## Architectural principles

- Preserve the stateless, in-memory design. Avoid writing temporary files to disk unless there is a very specific, justified exception (e.g. MP4 faststart).
- Keep service modules reusable, decoupled from Express request/response objects, and pure Buffer/Stream oriented.
- Maintain dual runtime compatibility: keep code compatible with both Node.js (>= 20) and Bun. Avoid runtime-exclusive APIs in `src/services/`.
- Support the three optimization modes consistently across all processors: `quality`, `balanced`, and `extreme`.
- Respect bypass and ignore directives such as `data-condense-ignore` and `/* condense-ignore */` when processing markup or code.
- Keep package exports compatible; if public APIs change, update `src/index.js` and `src/index.d.ts` as needed.

## Finding related code

1. Start with the relevant service module under `src/services/` when changing optimization behavior.
2. Follow imports from the public entry points in `src/index.js` or the controller/middleware layers when tracing request flow.
3. Check the matching test file in `tests/` for expected behavior and usage patterns.
4. Prefer small, focused changes over broad refactors.

## Validation requirements

Before considering work complete, verify the relevant behavior with fresh evidence:

- `npm test` (or `bun test`)
- `npm run lint`
- `npm run build`

When changing service behavior, add or update tests in `tests/` and prefer targeted test runs while iterating. Keep the package root exports and TypeScript declarations aligned with the public SDK surface.

## Coding guidelines

- Follow the existing style: 2-space indentation, single quotes, semicolons.
- Keep functions and modules small and focused.
- Prefer clear, reusable helpers over duplicated logic.
- Maintain compatibility with the package's existing public API surface.
- Keep changes aligned with the repository's purpose: fast, safe, and efficient optimization.
