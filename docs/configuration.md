# Configuration Guide

Condense provides clean configuration options spanning environment variables, request parameters, presets, and worker pools.

## Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port for the standalone HTTP server / microservice. |
| `CONDENSE_CACHE` | `false` | When set to `'true'`, activates the LRU cache for static assets. |
| `CONDENSE_CACHE_MAX` | `500` | Maximum number of items in the in-memory LRU cache. |
| `CONDENSE_WORKERS` | CPU count | Default number of threads to spawn for `WorkerPool`. |

## Built-In Optimization Presets

Condense v1.0.0 includes built-in presets for common production scenarios:

- **`web-hero`**: High-fidelity hero images (WebP/AVIF, target SSIM 0.96, balanced compression).
- **`avatar-thumbnail`**: Compact square avatars (256x256 cover fit, WebP, quality 75).
- **`production-bundle`**: Extreme code & script minification with comment and console removal.
- **`ultra-archive`**: Aggressive in-memory ZIP compression (level 9) with recursive asset optimization.
- **`email-safe`**: Conservative HTML and JPEG optimizations compatible with legacy email clients.
- **`social-share`**: 1200x630 social preview card generation.

### Registering Custom Presets

```javascript
const { presetService } = require('@studioframes/condense');

presetService.registerPreset('my-custom-recipe', {
  image: {
    format: 'webp',
    targetSsim: 0.94,
    method: 'balanced',
  },
  text: {
    method: 'extreme',
  },
});
```

## Request-Level Options (`POST /optimize`)

When using the HTTP API:

- `method`: `'quality'`, `'balanced'`, or `'extreme'`
- `preset`: Apply a named preset (e.g. `'web-hero'`)
- `targetSsim`: Floating-point SSIM target (e.g. `0.95`)
- `width`, `height`, `fit`: Dimension resizing (`'cover'`, `'contain'`, `'fill'`, `'inside'`, `'outside'`)
- `faststart`: Set to `'true'` to enable progressive MP4 streaming
- `thumbnail`: Set to `'true'` to extract a single video frame as a JPEG thumbnail

