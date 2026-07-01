# API Overview

Condense can be used in three main ways:

## Programmatic API

Import helpers from src/index.js for direct use in application code. This is the best option for custom integrations and server-side processing.

## CLI

Run the CLI through bin/cli.js to optimize files or directories from the command line.

## HTTP middleware or server

Use the Express app entry point in src/app.js to expose optimization endpoints for uploads and asset processing.

## Typical operations

- Optimize image buffers or streams
- Minify text-based assets
- Process audio and video content
- Handle WebAssembly optimization workflows
