# Condense v0.1.5

## Release Summary

This patch release focuses on optimizing runtime reliability and ensuring engine compatibility for `@studioframes/condense`. The core architectural features—such as stateless, in-memory processing via Buffers and Streams, multi-format pipelines, and flexible integration deployments—remain entirely unchanged.

## Dependency Updates & Engine Requirements

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
