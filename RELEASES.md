# Condense v0.3.4

## Release Summary

This patch release focuses on optimizing runtime and testing reliability, and ensuring engine compatibility for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Dependency Updates

We have updated underlying package to ensure seamless native module compilation.

* **Updated:** `js-yaml` bumped from `5.2.0` to `5.2.1`
* **Updated:** `sharp` bumped from `0.35.2` to `0.35.3`

## DevDependency Updates

We have updated underlying package to ensure seamless zero friction testing.

* **Updated:** `@types/node` bumped from `26.0.1` to `26.1.0`

## Installation

Update or install the new version directly from the npm registry:

```bash
npm install @studioframes/condense@0.3.4
```

# Condense v0.3.3

## Release Summary

This patch release focuses on optimizing runtime and testing reliability, and ensuring engine compatibility for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Dependency Updates

We have updated underlying package to ensure seamless native module compilation.

* **Updated:** `js-yaml` bumped from `5.1.0` to `5.2.0`

## DevDependency Updates

We have updated underlying package to ensure seamless zero friction testing.

* **Updated:** `prettier` bumped from `3.8.4` to `3.9.4`
* **Updated:** `eslint` bumped from `10.5.0` to `10.6.0`

## Installation

Update or install the new version directly from the npm registry:

```bash
npm install @studioframes/condense@0.3.3
```

# Condense v0.3.2

## Release Summary

This patch release addresses two CodeQL security vulnerabilities in the text optimization service related to XML comment stripping. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Security Fixes

* **Fixed:** Eliminated a polynomial regular expression vulnerability (ReDoS) in the XML text optimization pipeline.
* **Fixed:** Resolved an incomplete multi-character sanitization vulnerability that could potentially allow HTML element injection by switching to a safe, index-based looping approach for stripping XML comments.

## Installation

Update or install the new version directly from the npm registry:

```bash
npm install @studioframes/condense@0.3.2
```

---

# Condense v0.3.1

## Release Summary

This patch release focuses on optimizing runtime speed for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Removals

We have removed the directories and files that were accidentally left inside the pacakge.

- **Removed:** `demo` directory from package.
- **Removed:** `COMMANDS.md` file from package.

## Installation

Update or install the new version directly from the npm registry:

```bash
npm install @studioframes/condense@0.3.1
```

# Condense v0.3.0

## Release Summary

This minor release introduces major feature enhancements to Condense, focusing on broadening format capabilities, introducing a new CLI, and adding an intelligent `balanced` optimization method. The core architectural features remain intact, but powerful new capabilities like WebAssembly parsing, TypeScript minification, and in-memory LRU caching are now available.

## Features & Upgrades

* **New `balanced` Optimization Method:** Added a middle ground between `quality` and `extreme` which provides good compression and size without excessive loss of fidelity. Supported across images, media, text, and code.
* **TypeScript & React Support:** Added support for minifying `.ts`, `.jsx`, and `.tsx` files using `esbuild`.
* **Additional Text Formats:** Expanded text optimization to handle `.xml`, `.yaml`, `.yml`, `.graphql`, `.gql`, `.less`, and `.scss`.
* **In-Memory LRU Cache:** Added an optional LRU cache backed by `lru-cache` for frequently optimized static assets (enabled via `CONDENSE_CACHE=true`).
* **CLI `optimize` Subcommand:** Re-wrote the CLI to support a standalone `optimize` command with a beautiful ANSI-styled terminal UI, batch directory processing, and `-o` output flag.
* **Removed:** Markdown (`.md`) minification support has been dropped to streamline text processing capabilities.

## Dependency Updates

We have updated underlying packages to ensure seamless native module compilation.

* **Added:** `esbuild` for TypeScript/React compilation and minification.
* **Added:** `js-yaml` for YAML parsing and formatting.
* **Added:** `lru-cache` for high-performance in-memory asset caching.

## DevDependency Updates

We have updated underlying package to ensure seamless zero friction testing.

* **Updated:** `types/node` bumped from `26.0.0` to `26.0.1`

## Installation

Update or install the new version directly from the npm registry:

```bash
npm install @studioframes/condense@0.3.0
```

---

# Condense v0.2.2

## Release Summary

This patch release focuses on optimizing runtime reliability and ensuring engine compatibility for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Dependency Updates

We have updated underlying package to ensure seamless native module compilation.

* **Updated:** `sharp` bumped from `0.35.1` to `0.35.2`

## Installation

Update or install the new version directly from the npm registry:

```bash
npm install @studioframes/condense@0.2.2
```

---

# Condense v0.2.1

## Release Summary

This patch release focuses on optimizing testing reliability and ensuring engine compatibility for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## DevDependency Updates

We have updated underlying package to ensure seamless zero friction testing.

* **Updated:** `types/node` bumped from `25.8.3` to `26.0.0`
* **Updated:** `eslint` bumped from `8.57.1` to `10.5.0`

## Installation

Update or install the new version directly from the npm registry:

```bash
npm install @studioframes/condense@0.2.1
```

---

# Condense v0.2.0

## Release Summary

This minor release introduces major feature enhancements to Condense, focusing on broadening format capabilities and introducing intelligent dynamic options. The core architectural features remain intact, but powerful new capabilities like SVG/AVIF support and video frame extraction are now available.

## Features & Upgrades

* **AVIF and SVG Support:** In-memory optimization now supports modern `.avif` image formats natively, and utilizes `svgo` to securely minify `.svg` vector data.
* **Intelligent Dynamic Resizing (Responsive Images):** Developers can now pass `width`, `height`, and `fit` parameters (via query string or request body) to crop and scale structural images on-the-fly.
* **Animated WebP for GIFs:** GIF buffers are now automatically parsed and intelligently optimized into heavily compressed, animated WebP outputs.
* **Smart Frame Extraction:** Extracts a robust WebP thumbnail keyframe from heavy MP4/video files using the new `?thumbnail=true` query parameter.
* **Standard MP4 Faststart:** Allows developers to relocate the `moov` atom header inside an MP4 file, drastically decreasing buffering latency for conventional player streaming, available via `?faststart=true` (this feature utilizes a highly secure temporary bridging file when specifically invoked).
* **Diagnostics Endpoint:** A new `/health` status route provides instance metrics for CPU workload, structural memory limits, and platform statuses to verify robust scaling.

## Dependency Updates

We have updated underlying package to ensure seamless native module compilation.

* **Updated:** `terser` bumped from `5.31.1` to `5.48.0`

## Installation

Update or install the new version directly from the npm registry:

```bash
npm install @studioframes/condense@0.2.0
```

---

# Condense v0.1.6

## Release Summary

This patch release corrects package license metadata to comply with standard SPDX automated validation parsing, and optimizes cross-platform test execution scripts. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Metadata Updates

We have streamlined our internal metadata configurations and test runner patterns to improve cross-platform development reliability.

* **Updated:** Standardized `package.json` license format to strict SPDX compliance (`Apache-2.0`).
* **Optimized:** Escaped the `test` script directory glob matching (`"node --test \"tests//*.test.js\" "`) to guarantee reliable native test execution across Windows, Mac, and Linux environments.

## Known Vulnerabilities & Issues

Following an extensive supply-chain security evaluation using Socket, the following genuine behavioral observations and structural considerations are active for this release track:

### 1. Supply Chain Capability Flags (False Positives)

* **Status:** Resolved / Whitelisted via `socket.yml`.
* **Details:** Automated network heuristics flag core dependencies like `express` and `ffmpeg-static` for Network Access, and `commander` for Shell Access (`child_process`). These capabilities have been thoroughly audited; they are strictly restricted to intended functional tasks (binary distribution downloads, local routing execution, and parameter array piping via `spawn`) and pose zero security risks.

### 2. Runtime Code Obfuscation (False Positives)

* **Status:** Resolved / Whitelisted via `socket.yml`.
* **Details:** Core low-level WebAssembly utilities and runtime polyfills (`@emnapi/runtime`, `entities`, and `commander`) continue to flag automated heuristic scanners for containing potential obfuscation. These warnings are verified false positives triggered by routine environmental capabilities-probing string blocks (`new Function`), standard minification wrappers, and performance optimizations.

For more info visit: [Socket](https://socket.dev/npm/package/%40studioframes%2Fcondense) or [snyk Security](https://security.snyk.io/package/npm/%2540studioframes%252Fcondense).

## Bugs

If any new bugs or vulnerabilities are found please read and follow the steps carefully inside [SECURITY.md](https://github.com/studioframes/Condense/blob/main/SECURITY.md).

## Installation

Update or install the latest patch version directly from the npm registry:

```bash
npm install @studioframes/condense@0.1.6
```

---

# Condense v0.1.5

## Release Summary

This patch release focuses on optimizing runtime reliability and ensuring engine compatibility for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Dependency Updates

We have updated underlying package to ensure seamless native module compilation.

* **Updated:** `multer` bumped from `2.1.1` to `2.2.0`

## Known Vulnerabilities & Issues

Following an extensive supply-chain security evaluation using Socket, the following genuine behavioral observations and structural considerations are active for this release track:

### 1. Verification of Tree-Level Names (Potential Typosquat)

* **Status:** Under Investigation.
* **Details:** Automated network heuristics detected a dependency name structure (`camelcase`) deeply embedded within the transitive dependency tree that mirrors highly trafficked upstream assets. While no current malicious payload or backdoor vector has been confirmed, users are advised to audit nested lockfile distributions to verify exact import paths.

### 2. Unmaintained Upstream Core Frameworks

* **Status:** Monitored.
* **Details:** A core downstream parsing utility (`html-minifier-terser`) continues to operate on a codebase baseline that has not received active maintenance updates from its upstream maintainers in over five years. While functional baseline stability remains intact for standard HTML structures, unresolved architectural edge cases or future engine-level bugs may go unaddressed by the parent project.

For more info visit: [Socket](https://socket.dev/npm/package/%40studioframes%2Fcondense) or [snyk Security](https://security.snyk.io/package/npm/%2540studioframes%252Fcondense).

## Bugs

If any new bugs or vulnerabilities are found please read and follow the steps carefully inside [SECURITY.md](https://github.com/studioframes/Condense/blob/main/SECURITY.md).

## Installation

Update or install the latest patch version directly from the npm registry:

```bash
npm install @studioframes/condense@0.1.5
```

---

# Condense v0.1.4

## Release Summary

This patch release removes a deprecated FFmpeg wrapper dependency and replaces it with direct FFmpeg CLI invocation via Node's `child_process.spawn`. The refactoring maintains full backward compatibility while improving long-term maintainability and reducing dependency overhead. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Dependency Updates & Maintenance

We have addressed upstream maintenance concerns and eliminated a deprecated dependency:

* **Removed:** `fluent-ffmpeg@^2.1.3` — unmaintained wrapper (last update 2018)
* **Removed:** `ffprobe-static@^3.1.0` — no longer required
* **Retained:** `ffmpeg-static@^5.3.0` — provides platform-agnostic FFmpeg binary

### Technical Details

The `optimizeMediaStream()` function previously relied on the deprecated `fluent-ffmpeg` wrapper library to compose FFmpeg commands. This release refactors the media processing pipeline to invoke FFmpeg directly via spawned child processes, eliminating wrapper overhead and improving code clarity. The public function signature and streaming interface remain unchanged—consumers of the SDK see no behavioral difference.

* **Before:** `require('fluent-ffmpeg')(inputStream).format('mp4')...`
* **After:** Direct `spawn(ffmpegStatic, ['-i', 'pipe:0', '-f', 'mp4', ...])` invocation

All original encoding parameters, bitrate controls, aspect ratio scaling, MP4 fragmentation flags (`frag_keyframe+empty_moov`), and error handling are preserved.

## Known Vulnerabilities & Issues

Following an extensive supply-chain security evaluation using Socket, the following genuine behavioral observations and structural considerations are active for this release track:

### 1. Verification of Tree-Level Names (Potential Typosquat)

* **Status:** Under Investigation.
* **Details:** Automated network heuristics detected a dependency name structure (`camelcase`) deeply embedded within the transitive dependency tree that mirrors highly trafficked upstream assets. While no current malicious payload or backdoor vector has been confirmed, users are advised to audit nested lockfile distributions to verify exact import paths.

### 2. Unmaintained Upstream Core Frameworks

* **Status:** Monitored.
* **Details:** A core downstream parsing utility (`html-minifier-terser`) continues to operate on a codebase baseline that has not received active maintenance updates from its upstream maintainers in over five years. While functional baseline stability remains intact for standard HTML structures, unresolved architectural edge cases or future engine-level bugs may go unaddressed by the parent project.

For more info visit: [Socket](https://socket.dev/npm/package/%40studioframes%2Fcondense) or [snyk Security](https://security.snyk.io/package/npm/%2540studioframes%252Fcondense).

## Bugs

If any new bugs or vulnerabilities are found please read and follow the steps carefully inside [SECURITY.md](https://github.com/studioframes/Condense/blob/main/SECURITY.md).

## Installation

Update or install the latest patch version directly from the npm registry:

```bash
npm install @studioframes/condense@0.1.4
```

---

# Condense v0.1.3

## Release Summary

This patch release focuses on optimizing runtime reliability and ensuring engine compatibility for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Dependency Updates & Engine Requirements

We have updated underlying package to ensure seamless native module compilation.

* **Updated:** `sharp` bumped from `0.35.0` to `0.35.1`

## Known Vulnerabilities & Issues

Following an extensive supply-chain security evaluation using Socket, the following genuine behavioral observations and structural considerations are active for this release track:

### 1. Verification of Tree-Level Names (Potential Typosquat)

* **Status:** Under Investigation.
* **Details:** Automated network heuristics detected a dependency name structure (`camelcase`) deeply embedded within the transitive dependency tree that mirrors highly trafficked upstream assets. While no current malicious payload or backdoor vector has been confirmed, users are advised to audit nested lockfile distributions to verify exact import paths.

### 2. Unmaintained Upstream Core Frameworks

* **Status:** Monitored.
* **Details:** A core downstream parsing utility (`html-minifier-terser`) continues to operate on a codebase baseline that has not received active maintenance updates from its upstream maintainers in over five years. While functional baseline stability remains intact for standard HTML structures, unresolved architectural edge cases or future engine-level bugs may go unaddressed by the parent project.

For more info visit: [Socket](https://socket.dev/npm/package/%40studioframes%2Fcondense) or [snyk Security](https://security.snyk.io/package/npm/%2540studioframes%252Fcondense).

## Bugs

If any new bugs or vulnerabilities are found please read and follow the steps carefully inside [SECURITY.md](https://github.com/studioframes/Condense/blob/main/SECURITY.md).

## Installation

Update or install the latest patch version directly from the npm registry:

```bash
npm install @studioframes/condense@0.1.3
```

---

# Condense v0.1.2

## Release Summary

This patch release focuses on optimizing runtime reliability and ensuring engine compatibility for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Dependency Updates & Engine Requirements

We have updated underlying packages and explicitly defined environment requirements to ensure seamless native module compilation.

* **Added:** Explicit Node.js engine requirement (`>=20.9.0`) to guarantee compatibility with native binaries.
* **Updated:** `sharp` bumped from `0.34.5` to `0.35.0`

## Known Vulnerabilities & Issues

Following an extensive supply-chain security evaluation using Socket, the following genuine behavioral observations and structural considerations are active for this release track:

### 1. Verification of Tree-Level Names (Potential Typosquat)

* **Status:** Under Investigation.
* **Details:** Automated network heuristics detected a dependency name structure (`camelcase`) deeply embedded within the transitive dependency tree that mirrors highly trafficked upstream assets. While no current malicious payload or backdoor vector has been confirmed, users are advised to audit nested lockfile distributions to verify exact import paths.

### 2. Unmaintained Upstream Core Frameworks

* **Status:** Monitored.
* **Details:** A core downstream parsing utility (`html-minifier-terser`) continues to operate on a codebase baseline that has not received active maintenance updates from its upstream maintainers in over five years. While functional baseline stability remains intact for standard HTML structures, unresolved architectural edge cases or future engine-level bugs may go unaddressed by the parent project.

For more info visit: [Socket](https://socket.dev/npm/package/%40studioframes%2Fcondense) or [snyk Security](https://security.snyk.io/package/npm/%2540studioframes%252Fcondense)

## Bugs

If any new bugs or vulnerabilities are found please read and follow the steps carefully inside [SECURITY.md](https://github.com/studioframes/Condense/blob/main/SECURITY.md).

## Installation

Update or install the latest patch version directly from the npm registry:

```bash
npm install @studioframes/condense@0.1.2

```

---

# Condense v0.1.1

## Release Summary

This patch release focuses on critical dependency updates and security maintenance for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Dependency Updates

We have updated underlying packages to patch upstream bugs and optimize installation paths.

* **Updated:** `htmlparser2` bumped from `9.1.0` to `12.0.0`
* **Updated:** `express` bumped from `4.22.2` to `5.2.1`
* **Updated:** `sharp` bumped from `0.33.5` to `3.34.5`

## Known Vulnerabilities & Issues

Following an extensive supply-chain security evaluation using Socket, the following genuine behavioral observations and structural considerations are active for this release track:

### 1. Verification of Tree-Level Names (Potential Typosquat)

* **Status:** Under Investigation.
* **Details:** Automated network heuristics detected a dependency name structure (`camelcase`) deeply embedded within the transitive dependency tree that mirrors highly trafficked upstream assets. While no current malicious payload or backdoor vector has been confirmed, users are advised to audit nested lockfile distributions to verify exact import paths.

### 2. Unmaintained Upstream Core Frameworks

* **Status:** Monitored.
* **Details:** A core downstream parsing utility (`html-minifier-terser`) continues to operate on a codebase baseline that has not received active maintenance updates from its upstream maintainers in over five years. While functional baseline stability remains intact for standard HTML structures, unresolved architectural edge cases or future engine-level bugs may go unaddressed by the parent project.

## Bugs

If any new bugs or vulnerabilities are found please read and follow the steps carefully inside [SECURITY.md](https://github.com/studioframes/Condense/blob/main/SECURITY.md).

## Installation

Update or install the latest patch version directly from the npm registry:

```bash
npm install @studioframes/condense@0.1.1
```

---

# Condense v0.1.0

## Release Summary

We are pleased to announce the official initial release of `@studioframes/condense` (v0.1.0). This release introduces a high-performance, completely stateless file optimization and minification engine for Node.js. Designed for high-throughput and cloud-native architectures, Condense handles images, video, audio, and code assets entirely in-memory using native Buffers and Streams, completely eliminating local server disk dependency.

## Key Features and Capabilities

### 1. Zero Disk I/O Operations

* Implements a fully streaming and buffer-based processing architecture.
* Bypasses the local filesystem entirely to mitigate performance bottlenecks, asset leakage risks, and storage limits on ephemeral cloud environments (e.g., AWS Lambda, Google Cloud Functions).

### 2. Multi-Format Processing Pipeline

* **Markup & Scripting:** Efficient minification engines for HTML, CSS, JavaScript, and JSON.
* **Digital Imaging:** Lossless and lossy encoding pipelines for JPEG, PNG, and WebP, powered internally by Sharp.
* **Audio & Video:** Streaming optimization for MP4, MP3, and WAV assets utilizing embedded, platform-agnostic `ffmpeg-static` binaries.

### 3. Flexible Integration Architectures

* **Standalone CLI Microservice:** Can be initialized instantaneously as an independent service via `npx`.
* **Express Router Component:** Connects cleanly into existing Express frameworks as an isolated middleware routing hierarchy.
* **Programmatic SDK:** Exposes decoupled, low-level operational functions (`optimizeImage`, `optimizeText`, `optimizeMediaStream`) for micro-managed buffer workflows within specialized codebases.

### 4. Code-Level Processing Directives (Opt-Outs)

* Incorporates custom local attributes (`data-condense-ignore`) inside HTML elements to exclude targeted zones or entire files from the parsing lifecycle.
* Supports inline macro comments (`/* condense-ignore */`) to block the asset minification pass inside raw JavaScript and CSS modules.

## Supply Chain Security Posture

This package has been hardened from its initial release against software supply chain vectors:

* **Trusted Publishing (OIDC):** Package publication is completely tokenless. Handshakes are executed cryptographically using OpenID Connect authentication directly between GitHub Actions and the npm registry.
* **Build Provenance:** All builds generate a verifiable public provenance attestation, establishing an unalterable chain of custody mapping back to the open-source repository commit history.
* **Tag Protection Constraints:** Strict organizational rulesets are enforced on release tags (`v*`) to block arbitrary tag creation, history overrides, or force-deletion.
* **Runtime Sandboxing:** Media process tasks run inside isolated execution forks handled with exact runtime boundaries to mitigate algorithmic Denial of Service (DoS) exploits on malformed media structures.

## Installation and Quick Start

Install the production-ready build directly from the npm registry:

```bash
npm install @studioframes/condense
```

To run the standalone optimization server instance immediately:

```bash
npx @studioframes/condense
```
