# Architecture Notes

Condense is organized around small, reusable services that transform input buffers or streams into optimized output.

## Request flow

1. An incoming file or asset enters through the CLI, middleware, or programmatic API.
2. The request is routed through the controller or entry-point layer.
3. A matching service handles the optimization for the content type.
4. The optimized output is returned without relying on temporary files unless a specific workflow requires it.

## Service boundaries

- imageService handles raster and vector image transformations
- textService handles HTML, CSS, JavaScript, and related text assets
- mediaService handles audio and video streams
- esbuildService handles JavaScript and TypeScript bundling/minification workflows
- wasmService handles WebAssembly-specific transformations
- cacheService provides optional in-memory caching
