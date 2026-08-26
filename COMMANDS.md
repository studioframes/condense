# Condense CLI Commands

Condense comes with a fast, zero-dependency local file optimization CLI. You can run it via `npx` without installing it globally.

## Usage

```bash
npx @studioframes/condense optimize <input> [options]
```

## Arguments

- `<input>`: The file or directory you want to optimize. If you provide a directory, Condense recursively walks the folder and optimizes all supported file types (images, SVG, code, markup, TypeScript, fonts, PDFs, and archives).

## Options

### `-m, --method <method>`

Sets the optimization method to use:

- `quality` (Default): Visually lossless, safe compression preserving maximum fidelity. Recommended for general use.
- `balanced`: Optimal ratio between file size and quality. Introduces mild perceptual compression (e.g., 65% quality for JPEGs, crf 26 for video).
- `extreme`: Maximum compression prioritizing size over fidelity. Converts images to modern formats (WebP/AVIF), drops console logs in JS/TS, strips WASM custom sections, and downscales video.

### `-o, --output <path>`

Specifies the output destination for optimized files:

- **Default Behavior**: If you omit this flag, Condense optimizes files **in-place** (overwriting originals).
- **Single File Mode**: If the input is a single file, the output should be the desired output file path (e.g. `out.webp`, `bundle.min.js`).
- **Directory Mode**: If the input is a directory, the output should be a target directory. Condense mirrors the original directory structure inside the output folder and saves all optimized assets there, leaving source files untouched.

### `-h, --help`

Displays the help text and CLI usage reference.

## Examples

### Optimize a single file (Extreme Mode)

```bash
npx @studioframes/condense optimize photo.png -o out.webp --method extreme
```

### Batch optimize a directory (Balanced Mode)

_Reads all files from `./src/` and outputs the minified versions to `./dist/` while maintaining folder structure:_

```bash
npx @studioframes/condense optimize ./src/ -o ./dist/ --method balanced
```

### Optimize a directory in-place (Quality Mode)

_Optimizes all supported assets in the `./public` directory in-place:_

```bash
npx @studioframes/condense optimize ./public/
```

### Optimize font and archive files

```bash
npx @studioframes/condense optimize ./assets/Inter.ttf -o ./dist/Inter.ttf --method balanced
npx @studioframes/condense optimize ./release.zip -o ./dist/release.min.zip --method extreme
```

## Server Mode

Running the CLI without subcommands launches the standalone Express microservice:

```bash
npx @studioframes/condense
```

This spins up the server on port `3000` (or `PORT` environment variable), exposing `POST /optimize` and `GET /health` endpoints.

