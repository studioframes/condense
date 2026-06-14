# Changelog

All notable changes to Condense are documented in this file. This project follows [Semantic Versioning](https://semver.org/).

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
