# Overview

Condense is a stateless Node.js optimization engine for images, media, code, and WebAssembly. It is designed to run entirely in memory whenever possible so that it can fit into APIs, edge runtimes, containers, and serverless platforms without depending on temporary disk writes.

## What Condense optimizes

Condense can improve the size and delivery characteristics of:

- Raster and vector images such as PNG, JPEG, WebP, AVIF, GIF, and SVG
- Audio and video streams, including MP3, WAV, and MP4
- HTML, CSS, JavaScript, TypeScript, JSON, YAML, GraphQL, and related text assets
- WebAssembly binaries

## Core principles

- In-memory processing by default
- Stateless request handling for easy horizontal scaling
- Three optimization modes: quality, balanced, and extreme
- Compatibility with bypass directives such as data-condense-ignore and /* condense-ignore */
- A lightweight API surface that can be used from the CLI, an HTTP server, or application code

## Optimization modes

- quality: best fidelity with conservative compression
- balanced: a practical middle ground for most production workloads
- extreme: maximum compression with more aggressive transformations

## Typical use cases

- Optimizing uploaded image assets before storage or delivery
- Shrinking HTML, CSS, and JavaScript bundles for faster page loads
- Transforming media files for mobile or bandwidth-constrained clients
- Integrating optimization into a custom API or middleware layer

## Entry points

- [src/index.js](../src/index.js) exports the public SDK helpers
- [bin/cli.js](../bin/cli.js) provides the command-line experience
- [src/app.js](../src/app.js) wires the Express-based HTTP server

## Where to start

If you are new to Condense, begin with the SDK examples in [examples.md](examples.md), then move to [api.md](api.md) for integration details and [cli.md](cli.md) for batch workflows.
