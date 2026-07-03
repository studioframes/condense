# Changelog

All notable changes to Condense are documented in this file. This project follows [Semantic Versioning](https://semver.org/).

## [0.3.4] - 2026-07-03

### Changed
* Updated `js-yaml` from `5.2.0` to `5.2.1`
* Updated `sharp` from `0.35.2` to `0.35.3`
* Updated `@types/node` from `26.0.1` to `26.1.0`

## [0.3.3] - 2026-06-30

### Added
- New Condense ascii logo to cli

### Changed
- Updated `js-yaml` from 5.1.0 to 5.2.0.
- Updated `prettier` from 3.8.4 to 3.9.4
- Updated `eslint` from 10.5.0 to 10.6.0

## [0.3.2] - 2026-06-27

### Fixed
- **Security:** Fixed CodeQL vulnerabilities regarding incomplete multi-character sanitization and polynomial regular expression evaluation (ReDoS) in the XML/text service by transitioning from regular expressions to a safe loop-based string `indexOf` implementation for XML comment stripping.

## [0.3.1] - 2026-06-26

### Changed
- **Removed:** `demo` directory from package.
- **Removed:** `COMMANDS.md` file from package.

## [0.3.0] - 2026-06-26

### Added
- **New `balanced` Optimization Method:** Added a middle ground between `quality` and `extreme` which provides good compression and size without excessive loss of fidelity. Supported across images, media, text, and code.
- **TypeScript & React Support (`.ts`, `.jsx`, `.tsx`):** Added support for minifying TypeScript and React code using `esbuild`.
- **Additional Text Formats:** Expanded text optimization to handle `.xml`, `.yaml`, `.yml`, `.graphql`, `.gql`, `.less`, and `.scss`.
- **In-Memory LRU Cache:** Added an optional LRU cache backed by `lru-cache` for frequently optimized static assets (enabled via `CONDENSE_CACHE=true`).
- **CLI `optimize` Subcommand:** Re-wrote the CLI to support a standalone `optimize` command with a beautiful ANSI-styled terminal UI, batch directory processing, and `-o` output flag.

### Changed
- Refactored `optimizeController.js` to intelligently handle content negotiation, cache interception, and generic MIME type fallbacks.
- **Removed:** Markdown (`.md`) minification support.
- Updated `types/node` from 26.0.0 to 26.0.1.

---

## [0.2.2] - 2026-06-22

### Changed
- Updated `sharp` from 0.35.1 to 0.35.2.

---

## [0.2.1] - 2026-06-20

### Changed
- Updated `types/node` from 25.9.3 to 26.0.0.
- Updated `eslint` from 8.57.1 to 10.5.0.

---

## [0.2.0] - 2026-06-18

### Added
- **Broaden Format Support:** Added AVIF image optimization using `sharp`, SVG minification using `svgo`, and GIF frame optimization via animated WebP conversion.
- **Intelligent Dynamic Resizing:** Added support for responsive image resizing via `width`, `height`, and `fit` parameters.
- **Smart Frame Extraction:** Added thumbnailing for video streams to generate a quick WebP keyframe using the `?thumbnail=true` query parameter.
- **Standard MP4 Faststart:** Support for standard non-fragmented `moov` atom faststart relocation on video streams using `?faststart=true`.
- **Diagnostics API:** Added a lightweight `/health` metrics route for reporting active CPU load, memory utilization, and uptime.

### Changed
- Added `svgo` to package dependencies for SVG optimization logic.
- Updated `terser` from 5.31.1 to 5.48.0

---

## [0.1.6] - 2026-06-17

### Changed
- Updated license metadata in `package.json`.
- Updated `test` script in `package.json`.

---

## [0.1.5] - 2026-06-15

### Changed
- Updated `multer` from 2.1.1 to 2.2.0

---

## [0.1.4] - 2026-06-14

### Changed
- **Removed:** `fluent-ffmpeg@^2.1.3` — deprecated FFmpeg wrapper (last updated 2018)
- **Removed:** `ffprobe-static@^3.1.0` — no longer required
- Refactored media pipeline to use direct FFmpeg CLI via `child_process.spawn`
- Improved code clarity and reduced dependency overhead

### Added
- Comprehensive test suite (13 integration tests)
  - Image optimization tests (PNG, JPEG, quality/extreme modes)
  - Text minification tests (HTML, CSS, JS, ignore directives)
  - Media streaming tests (error handling, stream interface)
- TypeScript type definitions (`src/index.d.ts`)
- Example implementations (CLI, middleware, SDK patterns)

### Fixed
- Media processing maintains 100% backward compatibility
- All encoding parameters, bitrate controls, MP4 fragmentation preserved

---

## [0.1.3] - 2026-06-12

### Changed
- Updated `sharp` from 0.35.0 to 0.35.1 (runtime reliability)

---

## [0.1.2] - 2026-06-11

### Changed
- Added explicit Node.js engine requirement (`>=20.9.0`)
- Updated `sharp` from 0.34.5 to 0.35.0
- Updated `express` from 4.22.2 to 5.2.1
- Updated `htmlparser2` from 9.1.0 to 12.0.0

---

## [0.1.1] - 2026-06-09

### Added
- Critical dependency security updates
- Optimized installation paths

---

## [0.1.0] - 2026-06-08

### Added
- Initial release: stateless file optimization engine
- Zero Disk I/O architecture (Buffers and Streams)
- Multi-format pipeline (images, video, audio, code)
- Three integration modes: CLI, Express middleware, SDK
- Code-level bypass directives (`data-condense-ignore`)
