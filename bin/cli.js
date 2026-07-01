#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

// ── ANSI escape codes ─────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  conred: '\x1b[38;2;255;0;0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// ── Extension sets ─────────────────────────────────────────────────────────────
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);
const TEXT_EXTS = new Set([
  '.js', '.css', '.html', '.json', '.svg', '.xml',
  '.yaml', '.yml', '.less', '.scss', '.graphql', '.gql',
]);
const ESBUILD_EXTS = new Set(['.ts', '.jsx', '.tsx']);
const WASM_EXTS = new Set(['.wasm']);
const MEDIA_EXTS = new Set(['.mp3', '.wav', '.mp4']);

const ALL_SUPPORTED = new Set([
  ...IMAGE_EXTS, ...TEXT_EXTS, ...ESBUILD_EXTS, ...WASM_EXTS, ...MEDIA_EXTS,
]);

// ── Extension → MIME mapping ───────────────────────────────────────────────────
const EXT_TO_MIME = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.yaml': 'text/yaml',
  '.yml': 'text/yaml',
  '.less': 'text/less',
  '.scss': 'text/x-scss',
  '.graphql': 'application/graphql',
  '.gql': 'application/graphql',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.wasm': 'application/wasm',
};

// ── MIME → preferred extension (for format changes) ────────────────────────────
const MIME_TO_EXT = {
  'image/webp': '.webp',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/avif': '.avif',
  'image/gif': '.gif',
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  return (bytes / 1024).toFixed(1) + ' KB';
}

function printHeader() {
  console.log('');
  console.log(c.bold + c.conred +
`  ▄████████  ▄██████▄   ███▄▄▄▄   ████████▄       ▄████████ ███▄▄▄▄       ▄████████    ▄████████ 
  ███    ███ ███    ███ ███▀▀▀██▄ ███    ▀███     ███    ███ ███▀▀▀██▄    ███    ███    ███    ███ 
  ███    █▀  ███    ███ ███   ███ ███     ███     ███    █▀  ███   ███    ███    █▀     ███    █▀  
  ███        ███    ███ ███   ███ ███     ███   ▄███▄▄▄      ███   ███    ███          ▄███▄▄▄     
  ███        ███    ███ ███   ███ ███     ███  ▀▀███▀▀▀      ███   ███  ▀███████████  ▀▀███▀▀▀     
  ███    █▄  ███    ███ ███   ███ ███     ███     ███    █▄  ███   ███           ███    ███    █▄  
  ███    ███ ███    ███ ███   ███ ███    ▄███     ███    ███ ███   ███     ▄█    ███    ███    ███ 
  ████████▀   ▀██████▀   ▀█   █▀  ████████▀       ██████████  ▀█   █▀    ▄████████▀     ██████████ v${version}` + c.reset
  );
  console.log('');
}

/**
 * Recursively walk a directory and return absolute paths of files
 * with supported extensions.
 */
function collectFiles(dirPath) {
  const results = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALL_SUPPORTED.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

// ── Arg parser ─────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {
    input: null,
    method: 'quality',
    output: null,
    help: false,
  };

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
      i++;
    } else if (arg === '--method' || arg === '-m') {
      args.method = argv[++i] || 'quality';
      i++;
    } else if (arg === '--output' || arg === '-o') {
      args.output = argv[++i] || null;
      i++;
    } else if (!arg.startsWith('-') && args.input === null) {
      args.input = arg;
      i++;
    } else {
      i++;
    }
  }

  return args;
}

// ── Help text ──────────────────────────────────────────────────────────────────

function showHelp() {
  printHeader();
  console.log(`  ${c.bold}${c.white}USAGE${c.reset}`);
  console.log(`    ${c.cyan}condense optimize${c.reset} <input> [options]`);
  console.log('');
  console.log(`  ${c.bold}${c.white}ARGUMENTS${c.reset}`);
  console.log(`    ${c.cyan}<input>${c.reset}       File or directory to optimize`);
  console.log('');
  console.log(`  ${c.bold}${c.white}OPTIONS${c.reset}`);
  console.log(`    ${c.cyan}-m, --method${c.reset}  Optimization method (default: ${c.yellow}quality${c.reset})`);
  console.log(`                  ${c.dim}quality${c.reset}  – visually lossless, balanced`);
  console.log(`                  ${c.dim}balanced${c.reset} – good compression and size`);
  console.log(`                  ${c.dim}extreme${c.reset}  – maximum compression`);
  console.log(`    ${c.cyan}-o, --output${c.reset}  Output path (file or directory)`);
  console.log(`                  ${c.dim}Default: optimizes in-place${c.reset}`);
  console.log(`    ${c.cyan}-h, --help${c.reset}    Show this help text`);
  console.log('');
  console.log(`  ${c.bold}${c.white}EXAMPLES${c.reset}`);
  console.log(`    ${c.dim}$ condense optimize photo.png -o out.webp --method extreme${c.reset}`);
  console.log(`    ${c.dim}$ condense optimize ./src/ -o ./dist/ --method balanced${c.reset}`);
  console.log('');
}

// ── Optimize a single file ─────────────────────────────────────────────────────

async function optimizeFile(filePath, method) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = EXT_TO_MIME[ext];
  const buffer = fs.readFileSync(filePath);

  if (MEDIA_EXTS.has(ext)) {
    return { skipped: true, reason: 'Streaming media not suitable for CLI batch processing' };
  }

  if (IMAGE_EXTS.has(ext)) {
    const { optimizeImage } = require('../src/services/imageService');
    const result = await optimizeImage(buffer, mime, method);
    return { buffer: result.buffer, outMime: result.outMime };
  }

  if (TEXT_EXTS.has(ext)) {
    const { optimizeText } = require('../src/services/textService');
    const result = await optimizeText(buffer, mime, method);
    return { buffer: result.buffer, outMime: result.outMime };
  }

  if (ESBUILD_EXTS.has(ext)) {
    const { optimizeEsbuild } = require('../src/services/esbuildService');
    const result = await optimizeEsbuild(buffer, ext, method);
    return { buffer: result.buffer, outMime: result.outMime };
  }

  if (WASM_EXTS.has(ext)) {
    const { optimizeWasm } = require('../src/services/wasmService');
    const result = optimizeWasm(buffer, method);
    return { buffer: result.buffer, outMime: result.outMime };
  }

  return { skipped: true, reason: 'Unsupported file type' };
}

/**
 * Determine the output extension when the image service changes format
 * (e.g., PNG → WebP in extreme mode).
 */
function resolveOutputExt(originalExt, outMime) {
  if (!outMime) return originalExt;
  const newExt = MIME_TO_EXT[outMime];
  return newExt || originalExt;
}

// ── Main optimize command ──────────────────────────────────────────────────────

async function runOptimize(argv) {
  const args = parseArgs(argv);

  if (args.help) {
    showHelp();
    return;
  }

  if (!args.input) {
    showHelp();
    console.log(`  ${c.red}✗ Error: No input path provided.${c.reset}`);
    console.log('');
    process.exitCode = 1;
    return;
  }

  const inputPath = path.resolve(args.input);

  if (!fs.existsSync(inputPath)) {
    printHeader();
    console.log(`  ${c.red}✗ Error: Path not found: ${inputPath}${c.reset}`);
    console.log('');
    process.exitCode = 1;
    return;
  }

  const stat = fs.statSync(inputPath);
  const isDir = stat.isDirectory();

  // Collect files to process
  let files;
  if (isDir) {
    files = collectFiles(inputPath);
  } else {
    files = [inputPath];
  }

  if (files.length === 0) {
    printHeader();
    console.log(`  ${c.yellow}● No supported files found.${c.reset}`);
    console.log('');
    return;
  }

  // Resolve output directory (if provided and input is a directory)
  const outputDir = args.output && isDir ? path.resolve(args.output) : null;
  const outputFile = args.output && !isDir ? path.resolve(args.output) : null;

  if (outputDir) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  printHeader();
  console.log(`  ${c.yellow}● Processing ${files.length} file${files.length === 1 ? '' : 's'}...${c.reset}`);
  console.log('');

  // Compute max filename length for alignment
  const baseNames = files.map((f) => path.basename(f));
  const maxNameLen = Math.max(...baseNames.map((n) => n.length));

  let optimized = 0;
  let errors = 0;
  let totalReduction = 0;

  // Process files sequentially
  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const baseName = baseNames[i];
    const paddedName = baseName.padEnd(maxNameLen);
    const originalSize = fs.statSync(filePath).size;

    try {
      const result = await optimizeFile(filePath, args.method);

      if (result.skipped) {
        console.log(
          `  ${c.yellow}○${c.reset} ${c.white}${paddedName}${c.reset}  ${c.dim}Skipped: ${result.reason}${c.reset}`
        );
        continue;
      }

      const outputBuffer = Buffer.isBuffer(result.buffer) ? result.buffer : Buffer.from(result.buffer);
      const newSize = outputBuffer.length;
      const reduction = originalSize > 0 ? ((originalSize - newSize) / originalSize) * 100 : 0;

      // Determine output path
      let destPath;
      if (outputFile) {
        // Single file → explicit output path
        destPath = outputFile;
      } else if (outputDir) {
        // Directory mode → mirror relative path in output dir
        const relativePath = path.relative(inputPath, filePath);
        destPath = path.join(outputDir, relativePath);
      } else {
        // In-place
        destPath = filePath;
      }

      // Handle image format changes (e.g., PNG → WebP in extreme mode)
      if (result.outMime) {
        const originalExt = path.extname(destPath).toLowerCase();
        const newExt = resolveOutputExt(originalExt, result.outMime);
        if (newExt !== originalExt) {
          destPath = destPath.slice(0, -originalExt.length) + newExt;
        }
      }

      // Ensure destination directory exists
      const destDir = path.dirname(destPath);
      fs.mkdirSync(destDir, { recursive: true });

      // Write optimized file
      fs.writeFileSync(destPath, outputBuffer);

      const originalFormatted = formatSize(originalSize).padStart(9);
      const newFormatted = formatSize(newSize).padStart(9);

      console.log(
        `  ${c.green}✓${c.reset} ${c.white}${paddedName}${c.reset}  ${originalFormatted} → ${newFormatted}   ${c.green}▼ ${reduction.toFixed(1)}%${c.reset}`
      );

      optimized++;
      totalReduction += reduction;
    } catch (err) {
      errors++;
      console.log(
        `  ${c.red}✗${c.reset} ${c.white}${paddedName}${c.reset}  ${c.dim}${c.red}Error: ${err.message}${c.reset}`
      );
    }
  }

  const avgReduction = optimized > 0 ? (totalReduction / optimized).toFixed(1) : '0.0';

  console.log('');
  console.log(`  ${c.dim}${'─'.repeat(94)}${c.reset}`);
  console.log(
    `  ${c.green}✓ Done${c.reset} · ${optimized} optimized · ${errors} error${errors === 1 ? '' : 's'} · ${avgReduction}% avg reduction`
  );
  console.log('');
}

// ── Server mode ────────────────────────────────────────────────────────────────

function runServer() {
  const app = require('../src/app');
  const PORT = process.env.PORT || 3000;

  printHeader();
  console.log(`  ${c.yellow}● Server running on port ${PORT}${c.reset}`);
  console.log(`  ${c.yellow}● POST /optimize to process files${c.reset}`);
  console.log('');

  app.listen(PORT);
}

// ── Entry point ────────────────────────────────────────────────────────────────

const [,, subcommand, ...rest] = process.argv;

if (subcommand === 'optimize') {
  runOptimize(rest).catch((err) => {
    console.error(`  ${c.red}✗ Fatal: ${err.message}${c.reset}`);
    process.exitCode = 1;
  });
} else {
  // No subcommand (or unrecognized) → start Express server (backward compatible)
  runServer();
}