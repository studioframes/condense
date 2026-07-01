# Overview

Condense is a stateless Node.js optimization engine for images, media, code, and WebAssembly. It is designed to work in-memory and avoid unnecessary disk writes, making it suitable for servers, APIs, and serverless environments.

## What it does

Condense can optimize:

- Images such as PNG, JPEG, WebP, AVIF, GIF, and SVG
- Audio and video streams
- HTML, CSS, JavaScript, TypeScript, JSON, YAML, and related text assets
- WebAssembly binaries

## Core principles

- In-memory processing by default
- Stateless request handling
- Support for three optimization modes: quality, balanced, and extreme
- Respect for bypass directives such as data-condense-ignore and /* condense-ignore */

## Main entry points

- src/index.js exposes the public package API
- bin/cli.js provides the CLI experience
- src/app.js wires the Express-based server application
