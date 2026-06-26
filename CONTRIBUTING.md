# Contributing to Condense

Thank you for contributing to Condense! Please review this document before submitting issues or pull requests.

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/studioframes/Condense.git
   cd Condense
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Test your standalone CLI locally:
   ```bash
   npm start
   ```
4. Run the test suite:
   ```bash
   npm test
   ```

## Development Guidelines

Because Condense is distributed as an npm package, you must maintain compatibility across all three distribution paths:

1. **No Local Disk Access First:** Do not write temporary files to the disk (`/tmp`, `multer.diskStorage`, etc.) by default. Use pure in-memory Buffers and Node Streams to maintain statelessness. (Exception: Very specific structural overrides like MP4 faststart which strictly require file buffering).
2. **Keep Core Helpers Modular:** Ensure helper files inside `src/services/` are decoupled from Express HTTP objects (`req`, `res`) so they can still be safely imported programmatically.
3. **Respect Bypass Directives:** If adding new language processors, ensure they respect bypass parameters or check for `data-condense-ignore` patterns.
4. **Support Three Quality Tiers:** When implementing new optimizers, always handle `quality`, `balanced`, and `extreme` methods appropriately.
5. **Update Tests:** When modifying service functions, add or update corresponding tests in the `tests/` folder. Run `npm test` to verify all tests pass.

## Testing

Condense uses Node's built-in test framework. Tests live in the `tests/` directory and cover:

- **imageService.test.js** — Image optimization (PNG, JPEG, quality/balanced/extreme modes)
- **textService.test.js** — Code/markup minification (JS, CSS, HTML, XML, YAML, ignore directives)
- **mediaService.test.js** — Media streaming (audio/video processing, error handling)
- **esbuildService.test.js** — TypeScript and React minification tests
- **wasmService.test.js** — WebAssembly stripping tests
- **cacheService.test.js** — LRU caching tests
- **helpers.js** — Shared test utilities

Tests are development-only and excluded from published npm packages via `.npmignore`.

## Code Quality

### Formatting

Condense uses **Prettier** for automatic code formatting. Before committing, run:

```bash
npm run format
```

This ensures consistent code style across the project (2-space indentation, single quotes, semicolons).

### Linting

Condense uses **ESLint** to catch bugs and code quality issues:

```bash
npm run lint
```

Common issues caught: unused variables, unreachable code, inconsistent spacing, and more.

### Pre-Commit Checklist

Before submitting a PR, ensure:

```bash
npm run lint       # No linting errors
npm run format     # Code is formatted
npm test           # All tests pass
```

## Submission Workflow
1. Fork the repo and create your branch from `main`.
2. Commit your changes and ensure they don't break existing package exports.
3. Run `npm run lint` to check for code quality issues.
4. Run `npm run format` to auto-format code.
5. Run `npm test` to verify all tests pass before submitting a PR.
6. Submit a Pull Request targeting `main`.
