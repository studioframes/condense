# Development Guide

## Local setup

1. Install dependencies with npm install.
2. Run the test suite with npm test.
3. Run linting with npm run lint.
4. Run the build script with npm run build.

## Repository structure

- src/ contains the main implementation and public API
- src/services/ contains reusable optimization helpers
- src/controllers/ and src/middleware/ handle request flow
- tests/ contains Node.js test cases
- demo/ and examples/ provide sample assets and usage examples

## Contribution expectations

- Keep changes focused and reusable.
- Preserve the stateless, in-memory design.
- Update tests when changing optimization behavior.
- Keep public exports compatible unless a deliberate API change is required.
