# CLI Guide

The Condense CLI provides fast, zero-configuration local file and directory optimization directly from your terminal.

## Typical Commands

### Batch optimize a directory into an output directory
```bash
npx @studioframes/condense optimize ./src -o ./dist -m balanced
```

### Optimize a single image in extreme mode (converts to modern WebP/AVIF)
```bash
npx @studioframes/condense optimize photo.png -o out.webp -m extreme
```

### In-place optimization (modifies original files in-place)
```bash
npx @studioframes/condense optimize ./public
```

### Launch the standalone Express server microservice
```bash
npx @studioframes/condense
```

For complete flag details, see [COMMANDS.md](../COMMANDS.md).

## Common Options

- `-m, --method`: Selects the optimization mode (`quality`, `balanced`, or `extreme`).
- `-o, --output`: Sets the destination file or output directory.
- Input paths can point to an individual file or a directory (which is traversed recursively).

