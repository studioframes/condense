# Configuration Guide

Condense uses a small set of configuration patterns that are easy to understand in both local development and production deployments.

## Request-level options

The HTTP endpoint and programmatic helpers support a few relevant options depending on the content type:

- method: quality, balanced, or extreme
- width, height, fit: image resizing controls
- keepMetadata and keepFormat: preserve image metadata or format when possible
- faststart and thumbnail: media-specific controls for video processing
- targetFormat: request a preferred output image format when supported

## Environment variables

Condense currently uses the following environment-oriented pattern:

- CONDENSE_CACHE=true enables the optional LRU cache for non-streaming formats

When cache support is enabled, repeated optimization of the same content can be served from memory instead of reprocessing it.

## CLI options

Common CLI flags include:

- optimize: run the optimization workflow
- -m, --method: choose an optimization mode
- -o, --output: write the optimized output to a directory

Example:

```bash
npx @studioframes/condense optimize ./demo -o ./dist -m balanced
```

## Practical guidance

- Use quality for assets where visual fidelity matters most
- Use balanced for most default production use cases
- Use extreme when file size is more important than output fidelity
- Keep request parameters explicit when building APIs so downstream clients understand what will change
