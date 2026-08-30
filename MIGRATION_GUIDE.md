# Condense Migration Guide

This guide summarizes the changes developers should expect when upgrading Condense between releases. For a complete history of changes, see [CHANGELOG.md](./CHANGELOG.md).

## Security support and upgrade priority

Before planning a migration, use the latest supported release. According to [SECURITY.md](./SECURITY.md), the recommended target for upgrades is the latest stable release, currently **1.0.1**. View [SECURITY.md](./SECURITY.md) for more info.

## Upgrading from 0.3.x to 1.0.x

### Key Highlights
- **100% Backward-Compatible SDK**: All existing function signatures (`optimizeImage`, `optimizeText`, `optimizeMediaStream`, `optimizeEsbuild`, `optimizeWasm`, `condenseApp`) continue to work seamlessly.
- **New Fluent Pipeline API**: You can now chain optimization steps with `createPipeline()`.
- **Perceptual Compression (`optimizePerceptualImage`)**: You can now target specific SSIM quality levels (e.g. `ssim: 0.95`).
- **New Binary Processors**: Added native in-memory optimizers for ZIP archives (`optimizeZip`), SVG Spritesheets (`packSvgSprites`), Fonts (`optimizeFont`), and PDFs (`optimizePdf`).
- **Multi-Threaded Worker Pool**: Use `WorkerPool` or `getWorkerPool()` for CPU-intensive background batch processing across worker threads.

### Example: Adopting the Fluent Pipeline

```javascript
// Before (v0.3.x):
const { optimizeImage } = require('@studioframes/condense');
const { buffer } = await optimizeImage(rawImage, 'image/jpeg', 'balanced');

// In v1.0.0 (Fluent Pipeline with Presets):
const { createPipeline } = require('@studioframes/condense');
const resultBuffer = await createPipeline(rawImage, 'image/jpeg')
  .preset('web-hero')
  .toBuffer();
```

### Example: Upgrading Image Optimization with Perceptual SSIM Tuning

```javascript
const { optimizePerceptualImage } = require('@studioframes/condense');

const { buffer, ssim, finalQuality } = await optimizePerceptualImage(rawImage, 'image/jpeg', {
  targetSsim: 0.95,
  format: 'webp',
});
console.log(`Optimized to WebP at quality ${finalQuality} with SSIM ${ssim}`);
```

## 0.2.x to 0.3.x

### CLI changes

- The CLI is now centered around the `optimize` subcommand.
- Use `--method` (or `-m`) to choose `quality`, `balanced`, or `extreme`.
- Use `-o` to specify an output directory.

Example:

```bash
npx @studioframes/condense optimize ./src -o ./dist -m balanced
```

### New behavior and format support

- Added support for `.ts`, `.jsx`, `.tsx`, `.xml`, `.yaml`, `.yml`, `.graphql`, `.gql`, `.less`, and `.scss`.
- Added a new `balanced` optimization mode between `quality` and `extreme`.
- Added optional LRU caching, enabled with `CONDENSE_CACHE=true`.

### Compatibility notes

- Markdown (`.md`) minification is no longer supported.
- Existing ignore directives remain supported:
  - HTML: `data-condense-ignore`
  - Code: `/* condense-ignore */`

## 0.1.x to 0.2.x

- Existing integrations should continue to work without code changes.
- New optional query parameters are available for image resizing and media handling, including `width`, `height`, `fit`, `thumbnail`, and `faststart`.
- Added support for AVIF, SVG, GIF, and enhanced media processing.
- The media pipeline now uses the FFmpeg CLI directly instead of the previous wrapper dependency.

## General upgrade checklist

1. Upgrade the package to the latest version.
2. Re-test your core workflows with representative assets.
3. Verify any CLI commands and output paths.
4. Check whether your assets use unsupported formats or directives.
5. If you rely on caching, enable it explicitly with `CONDENSE_CACHE=true`.

## If you need help

- Review [CHANGELOG.md](./CHANGELOG.md) for the full release history.
- Consult the docs under [docs/](./docs/) for usage, CLI, and API examples.
