# Changelog

## v0.3.8 (2026-07-24)

### Dependencies

- [`88c8d90`](https://github.com/studioframes/condense/commit/88c8d90) Update `js-yaml` from `5.2.1` to `5.2.2`

## v0.3.7 (2026-07-22)

### DevDependencies

- [`5a5c98c`](https://github.com/studioframes/condense/commit/5a5c98c) Update `prettier` from `3.9.5` to `3.9.6`

## v0.3.6 (2026-07-18)

### Dependencies

- [`1538d90`](https://github.com/studioframes/condense/commit/1538d90) Update `svgo` from `4.0.1` to `4.0.2`

## v0.3.5 (2026-07-11)

### Dependencies

- [`b12b0b5`](https://github.com/studioframes/condense/commit/b12b0b5) Update `lru-cache` from `11.5.1` to `11.5.2`
- [`cb7750e`](https://github.com/studioframes/condense/commit/cb7750e) Update `terser` from `3.9.4` to `3.9.5`

### DevDependencies

- [`6144350`](https://github.com/studioframes/condense/commit/6144350) Update `@types/node` from `26.1.0` to `26.1.1`
- [`2925a8d`](https://github.com/studioframes/condense/commit/2925a8d) Update `prettier` from `3.9.4` to `3.9.5`

## v0.3.4 (2026-07-03)

### Dependencies

- [`b0e4f15`](https://github.com/studioframes/condense/commit/b0e4f15) Update `js-yaml` from `5.2.0` to `5.2.1`
- [`ab1b8d7`](https://github.com/studioframes/condense/commit/ab1b8d7) Update `sharp` from `0.35.2` to `0.35.3`

### DevDependencies

- [`851447c`](https://github.com/studioframes/condense/commit/851447c) Update `@types/node` from `26.0.1` to `26.1.0`

## v0.3.3 (2026-07-01)

### Dependencies

- [`1401e02`](https://github.com/studioframes/condense/commit/1401e02) Update `js-yaml` from `5.1.0` to `5.2.0`

### DevDependencies

- [`eecbde1`](https://github.com/studioframes/condense/commit/eecbde1) Update `prettier` from `3.8.4` to `3.9.4`
- [`a9c3e61`](https://github.com/studioframes/condense/commit/a9c3e61) Update `eslint` from `10.5.0` to `10.6.0`

## v0.3.2 (2026-06-27)

### Security

- [`c12e1ff`](https://github.com/studioframes/condense/commit/c12e1ff) Fix polynomial regular expression vulnerability (ReDoS) in XML text optimization pipeline
- [`c12e1ff`](https://github.com/studioframes/condense/commit/c12e1ff) Fix incomplete multi-character sanitization vulnerability by using index-based comment stripping to prevent HTML injection

## v0.3.1 (2026-06-26)

### Removed

- [`095d527`](https://github.com/studioframes/condense/commit/095d527) Remove `demo` directory from published package
- [`095d527`](https://github.com/studioframes/condense/commit/095d527) Remove `COMMANDS.md` file from published package

## v0.3.0 (2026-06-26)

### Added

- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Add `balanced` optimization preset across images, media, text, and code
- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Add TypeScript and React minification support (`.ts`, `.jsx`, `.tsx`) via `esbuild`
- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Add optimization support for `.xml`, `.yaml`, `.yml`, `.graphql`, `.gql`, `.less`, and `.scss` text formats
- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Add optional in-memory LRU cache backed by `lru-cache` (enabled via `CONDENSE_CACHE=true`)
- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Add standalone CLI `optimize` subcommand featuring terminal UI, batch directory processing, and `-o` output flag

### Removed

- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Remove Markdown (`.md`) minification support

### Dependencies

- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Add `esbuild` dependency for TypeScript and React processing
- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Add `js-yaml` dependency for YAML handling
- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Add `lru-cache` dependency for asset caching

### DevDependencies

- [`f2b203a`](https://github.com/studioframes/condense/commit/f2b203a) Update `@types/node` from `26.0.0` to `26.0.1`

## v0.2.2 (2026-06-22)

### Dependencies

- [`6e4c578`](https://github.com/studioframes/condense/commit/6e4c578) Update `sharp` from `0.35.1` to `0.35.2`

## v0.2.1 (2026-06-20)

### DevDependencies

- [`91e2ad9`](https://github.com/studioframes/condense/commit/91e2ad9) Update `@types/node` from `25.8.3` to `26.0.0`
- [`c3a6ddb`](https://github.com/studioframes/condense/commit/c3a6ddb) Update `eslint` from `8.57.1` to `10.5.0`

## v0.2.0 (2026-06-18)

### Added

- [`b2799d7`](https://github.com/studioframes/condense/commit/b2799d7) Add native `.avif` image optimization and `.svg` vector minification via `svgo`
- [`b2799d7`](https://github.com/studioframes/condense/commit/b2799d7) Add dynamic image resizing support using `width`, `height`, and `fit` parameters
- [`b2799d7`](https://github.com/studioframes/condense/commit/b2799d7) Add automatic GIF buffer conversion and optimization to animated WebP outputs
- [`b2799d7`](https://github.com/studioframes/condense/commit/b2799d7) Add WebP keyframe thumbnail extraction for MP4/video files using `?thumbnail=true`
- [`b2799d7`](https://github.com/studioframes/condense/commit/b2799d7) Add MP4 faststart capability to relocate the `moov` atom header via `?faststart=true`
- [`b2799d7`](https://github.com/studioframes/condense/commit/b2799d7) Add `/health` diagnostic endpoint for CPU workload, memory limits, and runtime statuses

### Dependencies

- [`b2799d7`](https://github.com/studioframes/condense/commit/b2799d7) Update `terser` from `5.31.1` to `5.48.0`

## v0.1.6 (2026-06-17)

### Changed

- [`410fecf`](https://github.com/studioframes/condense/commit/410fecf) Standardize `package.json` license format to strict SPDX compliance (`Apache-2.0`)
- [`410fecf`](https://github.com/studioframes/condense/commit/410fecf) Escape `test` script directory glob matching for cross-platform execution

## v0.1.5 (2026-06-15)

### Dependencies

- [`f36c9e4`](https://github.com/studioframes/condense/commit/f36c9e4) Update `multer` from `2.1.1` to `2.2.0`

## v0.1.4 (2026-06-14)

### Changed

- [`7434318`](https://github.com/studioframes/condense/commit/7434318) Refactor `optimizeMediaStream()` to execute FFmpeg directly via Node `child_process.spawn`

### Removed

- [`7434318`](https://github.com/studioframes/condense/commit/7434318) Remove deprecated `fluent-ffmpeg` dependency
- [`7434318`](https://github.com/studioframes/condense/commit/7434318) Remove `ffprobe-static` dependency

## v0.1.3 (2026-06-12)

### Dependencies

- [`a464791`](https://github.com/studioframes/condense/commit/a464791) Update `sharp` from `0.35.0` to `0.35.1`

## v0.1.2 (2026-06-11)

### Added

- [`26da91c`](https://github.com/studioframes/condense/commit/26da91c) Add explicit Node.js engine constraint (`>=20.9.0`) to `package.json`

### Dependencies

- [`d55a998`](https://github.com/studioframes/condense/commit/d55a998) Update `sharp` from `0.34.5` to `0.35.0`

## v0.1.1 (2026-06-09)

### Dependencies

- [`2c2e103`](https://github.com/studioframes/condense/commit/2c2e103) Update `htmlparser2` from `9.1.0` to `12.0.0`
- [`651b89b`](https://github.com/studioframes/condense/commit/651b89b) Update `express` from `4.22.2` to `5.2.1`
- [`46f4859`](https://github.com/studioframes/condense/commit/46f4859) Update `sharp` from `0.33.5` to `0.34.5`

## v0.1.0 (2026-06-08)

### Added

- [`eb00ab3`](https://github.com/studioframes/condense/commit/eb00ab3) Initial release of `@studioframes/condense`
- [`eb00ab3`](https://github.com/studioframes/condense/commit/eb00ab3) Implement stateless, zero-disk I/O architecture using native Buffers and Streams
- [`eb00ab3`](https://github.com/studioframes/condense/commit/eb00ab3) Add multi-format optimization support for HTML, CSS, JS, JSON, JPEG, PNG, WebP, MP4, MP3, and WAV
- [`eb00ab3`](https://github.com/studioframes/condense/commit/eb00ab3) Add deployment support for standalone CLI microservices, Express router middleware, and programmatic SDK
- [`eb00ab3`](https://github.com/studioframes/condense/commit/eb00ab3) Add `data-condense-ignore` attribute and `/* condense-ignore */` inline comment directive support
