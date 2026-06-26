# Condense CLI Commands

Condense comes with a powerful, fully-featured CLI for local file optimization. You can run it via `npx` without installing it globally.

## Usage

```bash
npx @studioframes/condense optimize <input> [options]
```

## Arguments

- `<input>`: The file or directory you want to optimize. If you provide a directory, Condense will recursively walk the directory and optimize all supported file types.

## Options

### `-m, --method <method>`
Sets the optimization method to use. 
- `quality` (Default): Visually lossless, balanced compression. Recommended for general use.
- `balanced`: A sweet spot between file size and quality. Introduces mild lossy compression (e.g. 65% quality for JPEGs, crf 26 for video).
- `extreme`: Maximum compression. Prioritizes size over fidelity. Forces image conversions to modern formats like WebP or AVIF, drops console logs in JS, strips WASM custom sections, and downscales video.

### `-o, --output <path>`
Specifies the output path for the optimized files.
- **Default Behavior**: If you omit this flag, Condense will optimize the files **in-place** (overwriting the originals).
- **Single File Mode**: If the input is a file, the output should be the desired output file path (e.g., `out.webp`).
- **Directory Mode**: If the input is a directory, the output should be a target directory. Condense will recreate the original directory structure inside the output folder and save all minified files there, leaving your source files completely untouched.

### `-h, --help`
Displays the help text and CLI usage information.

## Examples

### Optimize a single file (Extreme Mode)
```bash
npx @studioframes/condense optimize photo.png -o out.webp --method extreme
```

### Batch optimize a directory (Balanced Mode)
*This command reads all files from `./src/` and outputs the minified versions to `./dist/` while maintaining the folder structure.*
```bash
npx @studioframes/condense optimize ./src/ -o ./dist/ --method balanced
```

### Optimize a directory in-place (Quality Mode)
*This command overrides all supported files in the `./public` directory.*
```bash
npx @studioframes/condense optimize ./public/
```

## Server Mode

If you run the CLI without the `optimize` subcommand, it will launch the standalone Express server:

```bash
npx @studioframes/condense
```

This will spin up the server on port `3000` (or `process.env.PORT`), allowing you to POST files to `/optimize` to use Condense as a network-accessible microservice.
