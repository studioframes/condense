# Development Guide

This guide is meant for contributors and maintainers working on Condense locally.

## Local setup

1. Install dependencies with npm install.
2. Run the test suite with npm test.
3. Run linting with npm run lint.
4. Run the build script with npm run build.

## Repository layout

- src/ contains the public API, Express app, controllers, middleware, and services
- src/services/ contains the format-specific optimization logic
- tests/ contains Node.js test cases for each service
- demo/ and examples/ provide sample assets and integration patterns
- docs/ contains the end-user and contributor documentation

## Typical contributor workflow

1. Identify the service or layer that owns the behavior you want to change.
2. Add or update tests before changing behavior when possible.
3. Make a focused change that preserves the existing public API unless a breaking change is intentional.
4. Re-run the relevant tests and the full validation commands.

## Validation commands

Run these before opening or updating a pull request:

```bash
npm test
npm run lint
npm run build
```

## Adding a new optimization path

When introducing a new format or processor:

- Add the implementation under src/services/
- Route the new format through the controller logic if it is exposed via the HTTP API
- Add tests under tests/
- Update the relevant docs and examples

## Code style expectations

- Follow the existing 2-space indentation style
- Keep functions small and focused
- Prefer reusable helpers over duplicated logic
- Preserve the stateless, in-memory architecture unless a specific exception is justified
