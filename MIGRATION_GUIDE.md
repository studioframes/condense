# Condense Migration Guide

This guide summarizes the changes developers should expect when upgrading Condense between releases. For a complete history of changes, see [CHANGELOG.md](./CHANGELOG.md).

## Security support and upgrade priority

Before planning a migration, use the latest supported release. According to [SECURITY.md](./SECURITY.md), the recommended target for upgrades is the latest stable release, currently 0.3.4.

| Current version | Status | Recommended action |
| --- | --- | --- |
| 0.3.4 | Active | Keep using the latest stable release. |
| 0.3.3 / 0.3.2 | Unmaintained | Upgrade to 0.3.4+ as soon as practical. |
| 0.3.1 / 0.3.0 | Deprecated | Upgrade immediately; these releases contain security vulnerabilities that were patched in 0.3.2. |
| 0.2.x | Unmaintained | Upgrade to 0.3.0+ before relying on it in production. |
| 0.1.x | Deprecated | Upgrade to 0.2.0+ and re-test integrations thoroughly. |

If you are still on 0.3.0 or 0.3.1, treat that as a security-sensitive migration and prioritize it above normal dependency updates.

## Current version notes

### Upgrading from 0.3.x to 0.3.4

- No breaking API changes are documented for the core optimization helpers.
- The update is a dependency refresh and should be safe for existing integrations.
- If you use the CLI, the supported entry point remains:

```bash
npx @studioframes/condense optimize ./path/to/input -o ./path/to/output --method balanced
```

## 0.2.x to 0.3.0

### CLI changes

- The CLI is now centered around the `optimize` subcommand.
- Use `--method` (or `-m`) to choose `quality`, `balanced`, or `extreme`.
- Use `-o` to specify an output directory.

Example:

```bash
npx @studioframes/condense optimize ./src -o ./dist -m balanced
```

### New behavior and format support

- Added support for `.ts`, `.jsx`, `.tsx`, `.xml`, `.yaml`, `.yml`, `.graphql`, `.gql`, `.less`, and `.scss`.
- Added a new `balanced` optimization mode between `quality` and `extreme`.
- Added optional LRU caching, enabled with `CONDENSE_CACHE=true`.

### Compatibility notes

- Markdown (`.md`) minification is no longer supported.
- Existing ignore directives remain supported:
  - HTML: `data-condense-ignore`
  - Code: `/* condense-ignore */`

## 0.1.x to 0.2.0

- Existing integrations should continue to work without code changes.
- New optional query parameters are available for image resizing and media handling, including `width`, `height`, `fit`, `thumbnail`, and `faststart`.
- Added support for AVIF, SVG, GIF, and enhanced media processing.
- The media pipeline now uses the FFmpeg CLI directly instead of the previous wrapper dependency.

## General upgrade checklist

1. Upgrade the package to the latest version.
2. Re-test your core workflows with representative assets.
3. Verify any CLI commands and output paths.
4. Check whether your assets use unsupported formats or directives.
5. If you rely on caching, enable it explicitly with `CONDENSE_CACHE=true`.

## If you need help

- Review [CHANGELOG.md](./CHANGELOG.md) for the full release history.
- Consult the docs under [docs/](./docs/) for usage, CLI, and API examples.
