# Dependencies

This document summarizes the direct dependencies used by Condense and the role each one plays in the project.

## Runtime dependencies

| Dependency | Purpose in Condense |
| --- | --- |
| clean-css | Minifies CSS assets and strips unnecessary whitespace and comments. |
| esbuild | Transpiles and bundles modern JavaScript and TypeScript, including JSX/TSX support. |
| express | Provides the HTTP server and middleware layer for the API and upload routes. |
| ffmpeg-static | Supplies the FFmpeg binary used by the media pipeline for video and audio processing. |
| html-minifier-terser | Minifies HTML content while preserving safe output and removing unnecessary markup. |
| htmlparser2 | Parses HTML and related markup so the text pipeline can inspect and transform content reliably. |
| js-yaml | Parses and serializes YAML content for text optimization and config handling. |
| lru-cache | Implements optional in-memory caching for frequently optimized assets. |
| multer | Handles multipart file uploads for the optimization API. |
| sharp | Performs image decoding, encoding, resizing, format conversion, and metadata handling. |
| svgo | Optimizes SVG assets by removing redundant markup and attributes. |
| terser | Minifies JavaScript and strips dead code, comments, and whitespace. |

## Development dependencies

| Dependency | Purpose in Condense |
| --- | --- |
| @types/express | Adds TypeScript definitions for Express APIs used by the project. |
| @types/node | Provides Node.js type definitions for development and editor tooling. |
| eslint | Enforces coding standards and catches common issues during development. |
| prettier | Formats source files consistently across the repository. |

## Notes

- Runtime dependencies are the packages Condense relies on when serving requests or processing assets.
- Development dependencies support testing, linting, formatting, and editor compatibility.
- If you are changing optimization behavior, check the relevant service module and the dependency that powers it before making modifications.
