# Condense Agents Instructions

## Project overview

Condense is a Node.js optimization engine for images, media, code, and WebAssembly. It is designed to be stateless and in-memory, with minimal disk usage and no temporary file writes by default.

## Repository layout

- src/: main implementation and public API
  - src/index.js: package exports and public entry points
  - src/app.js: Express app wiring
  - src/controllers/: request handling logic
  - src/middleware/: upload and request middleware
  - src/services/: optimization helpers for images, text, media, esbuild, WASM, and caching
- bin/: CLI entry point
- tests/: Node.js built-in test suite
- demo/: example assets and sample outputs
- examples/: small usage examples for CLI, middleware, and SDK usage
- docs/: contains the Condense documentation

## Architectural principles

- Preserve the stateless, in-memory design. Avoid writing temporary files to disk unless there is a very specific, justified exception.
- Keep service modules reusable and decoupled from Express request/response objects.
- Support the three optimization modes consistently: quality, balanced, and extreme.
- Respect bypass and ignore directives such as data-condense-ignore and /* condense-ignore */ when adding new processors.
- Keep package exports compatible; if public APIs change, update src/index.js and src/index.d.ts as needed.

## Finding related code

1. Start with the relevant service module under src/services/ when changing optimization behavior.
2. Follow imports from the public entry points in src/index.js or the controller/middleware layers when tracing request flow.
3. Check the matching test file in tests/ for expected behavior and usage patterns.
4. Prefer small, focused changes over broad refactors.

## Validation requirements

Before considering work complete, verify the relevant behavior with fresh evidence:

- npm test
- npm run lint
- npm run build

When changing service behavior, add or update tests in tests/ and prefer targeted test runs while iterating.

## Coding guidelines

- Follow the existing style: 2-space indentation, single quotes, semicolons.
- Keep functions and modules small and focused.
- Prefer clear, reusable helpers over duplicated logic.
- Maintain compatibility with the package's existing public API surface.
- Keep changes aligned with the repository's purpose: fast, safe, and efficient optimization.
