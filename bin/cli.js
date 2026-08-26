#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

// ── ANSI Escape Codes ─────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  // Custom 24-bit TrueColor Palette from CSS
  foreground: '\x1b[38;2;250;250;250m' /* #fafafa */,
  muted: '\x1b[38;2;136;136;136m' /* rgb(136,136,136) */,
  faint: '\x1b[38;2;114;114;114m' /* rgb(114,114,114) */,
  border: '\x1b[38;2;39;39;42m' /* #27272a */,

  // Brand & Accent Colors
  cyan: '\x1b[38;2;0;223;216m' /* Cyan streak */,
  purple: '\x1b[38;2;124;58;237m' /* Accent */,
  green: '\x1b[38;2;134;239;172m' /* Success Green */,
  amber: '\x1b[38;2;245;158;11m' /* Amber Gold */,
  red: '\x1b[38;2;239;68;68m' /* Error Red */,
};

// ── Extension sets ─────────────────────────────────────────────────────────────
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);
const TEXT_EXTS = new Set([
  '.js',
  '.mjs',
  '.cjs',
  '.css',
  '.html',
  '.htm',
  '.json',
  '.svg',
  '.xml',
  '.yaml',
  '.yml',
  '.less',
  '.scss',
  '.graphql',
  '.gql',
]);
const ESBUILD_EXTS = new Set(['.ts', '.jsx', '.tsx']);
const WASM_EXTS = new Set(['.wasm']);
const ARCHIVE_EXTS = new Set(['.zip']);
const FONT_EXTS = new Set(['.ttf', '.otf', '.woff', '.woff2']);
const PDF_EXTS = new Set(['.pdf']);
const MEDIA_EXTS = new Set(['.mp3', '.wav', '.mp4']);

const ALL_SUPPORTED = new Set([
  ...IMAGE_EXTS,
  ...TEXT_EXTS,
  ...ESBUILD_EXTS,
  ...WASM_EXTS,
  ...ARCHIVE_EXTS,
  ...FONT_EXTS,
  ...PDF_EXTS,
  ...MEDIA_EXTS,
]);

// ── Extension → MIME mapping ───────────────────────────────────────────────────
const EXT_TO_MIME = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.cjs': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.htm': 'text/html',
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
  '.zip': 'application/zip',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
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
  console.log(c.bold + c.foreground + 'Condense CLI ' + c.muted + `v${version}` + c.reset);
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
    preset: null,
    perceptual: false,
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
    } else if (arg === '--preset' || arg === '-p') {
      args.preset = argv[++i] || null;
      i++;
    } else if (arg === '--perceptual') {
      args.perceptual = true;
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
  console.log(`  ${c.bold}${c.foreground}USAGE${c.reset}`);
  console.log(`    ${c.cyan}condense optimize${c.reset} ${c.muted}<input> [options]${c.reset}`);
  console.log('');
  console.log(`  ${c.bold}${c.foreground}ARGUMENTS${c.reset}`);
  console.log(`    ${c.cyan}<input>${c.reset}        File or directory to optimize`);
  console.log('');
  console.log(`  ${c.bold}${c.foreground}OPTIONS${c.reset}`);
  console.log(
    `    ${c.cyan}-m, --method${c.reset}     Optimization method (default: ${c.amber}quality${c.reset})`
  );
  console.log(`                     ${c.muted}quality${c.reset}  – visually lossless, balanced`);
  console.log(`                     ${c.muted}balanced${c.reset} – good compression and size`);
  console.log(`                     ${c.muted}extreme${c.reset}  – maximum compression`);
  console.log(`    ${c.cyan}-p, --preset${c.reset}     Built-in recipe (e.g. web-hero, avatar, thumbnail, podcast-audio)`);
  console.log(`    ${c.cyan}--perceptual${c.reset}     Adaptive SSIM perceptual tuning for images`);
  console.log(`    ${c.cyan}-o, --output${c.reset}     Output path (file or directory)`);
  console.log(`                     ${c.muted}Default: optimizes in-place${c.reset}`);
  console.log(`    ${c.cyan}-h, --help${c.reset}       Show this help text`);
  console.log('');
  console.log(`  ${c.bold}${c.foreground}EXAMPLES${c.reset}`);
  console.log(`    ${c.faint}$ condense optimize photo.png -o out.webp --method extreme${c.reset}`);
  console.log(`    ${c.faint}$ condense optimize ./src/ -o ./dist/ --method balanced${c.reset}`);
  console.log(`    ${c.faint}$ condense optimize bundle.zip --preset lossless-archive${c.reset}`);
  console.log('');
}

// ── Optimize a single file ─────────────────────────────────────────────────────

async function optimizeFile(filePath, options = {}) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = EXT_TO_MIME[ext];
  const buffer = fs.readFileSync(filePath);
  const method = options.method || 'quality';

  if (MEDIA_EXTS.has(ext)) {
    return { skipped: true, reason: 'Streaming media not suitable for CLI batch processing' };
  }

  if (IMAGE_EXTS.has(ext)) {
    const { optimizeImage, optimizePerceptualImage } = require('../src/services/imageService');
    if (options.perceptual) {
      const result = await optimizePerceptualImage(buffer, mime, options);
      return { buffer: result.buffer, outMime: result.outMime };
    }
    const result = await optimizeImage(buffer, mime, method, options);
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

  if (ARCHIVE_EXTS.has(ext)) {
    const { optimizeZip } = require('../src/services/archiveService');
    const result = await optimizeZip(buffer, { method, ...options });
    return { buffer: result.buffer, outMime: result.outMime };
  }

  if (FONT_EXTS.has(ext)) {
    const { optimizeFont } = require('../src/services/fontService');
    const result = optimizeFont(buffer, { method, ...options });
    return { buffer: result.buffer, outMime: result.outMime };
  }

  if (PDF_EXTS.has(ext)) {
    const { optimizePdf } = require('../src/services/pdfService');
    const result = optimizePdf(buffer, { method, ...options });
    return { buffer: result.buffer, outMime: result.outMime };
  }

  return { skipped: true, reason: 'Unsupported file type' };
}

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

  let files;
  if (isDir) {
    files = collectFiles(inputPath);
  } else {
    files = [inputPath];
  }

  if (files.length === 0) {
    printHeader();
    console.log(`  ${c.muted}● No supported files found.${c.reset}`);
    console.log('');
    return;
  }

  const outputDir = args.output && isDir ? path.resolve(args.output) : null;
  const outputFile = args.output && !isDir ? path.resolve(args.output) : null;

  if (outputDir) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  printHeader();
  console.log(
    `  ${c.muted}● Processing ${files.length} file${files.length === 1 ? '' : 's'}...${c.reset}`
  );
  console.log('');

  const baseNames = files.map((f) => path.basename(f));
  const maxNameLen = Math.max(...baseNames.map((n) => n.length));

  let optimized = 0;
  let errors = 0;
  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const baseName = baseNames[i];
    const paddedName = baseName.padEnd(maxNameLen);
    const originalSize = fs.statSync(filePath).size;
    totalOriginalBytes += originalSize;

    try {
      const result = await optimizeFile(filePath, args);

      if (result.skipped) {
        console.log(
          `  ${c.muted}○${c.reset} ${c.foreground}${paddedName}${c.reset}  ${c.faint}Skipped: ${result.reason}${c.reset}`
        );
        totalOptimizedBytes += originalSize;
        continue;
      }

      const outputBuffer = Buffer.isBuffer(result.buffer)
        ? result.buffer
        : Buffer.from(result.buffer);
      const newSize = outputBuffer.length;
      totalOptimizedBytes += newSize;
      const reduction = originalSize > 0 ? ((originalSize - newSize) / originalSize) * 100 : 0;

      let destPath;
      if (outputFile) {
        destPath = outputFile;
      } else if (outputDir) {
        const relativePath = path.relative(inputPath, filePath);
        destPath = path.join(outputDir, relativePath);
      } else {
        destPath = filePath;
      }

      if (result.outMime) {
        const originalExt = path.extname(destPath).toLowerCase();
        const newExt = resolveOutputExt(originalExt, result.outMime);
        if (newExt !== originalExt) {
          destPath = destPath.slice(0, -originalExt.length) + newExt;
        }
      }

      const destDir = path.dirname(destPath);
      fs.mkdirSync(destDir, { recursive: true });

      fs.writeFileSync(destPath, outputBuffer);

      const originalFormatted = formatSize(originalSize).padStart(9);
      const newFormatted = formatSize(newSize).padStart(9);

      console.log(
        `  ${c.green}✓${c.reset} ${c.foreground}${paddedName}${c.reset}  ${c.muted}${originalFormatted}${c.reset} → ${c.foreground}${newFormatted}${c.reset}   ${c.green}▼ ${reduction.toFixed(1)}%${c.reset}`
      );

      optimized++;
    } catch (err) {
      errors++;
      totalOptimizedBytes += originalSize;
      console.log(
        `  ${c.red}✗${c.reset} ${c.foreground}${paddedName}${c.reset}  ${c.red}Error: ${err.message}${c.reset}`
      );
    }
  }

  const bytesSaved = Math.max(0, totalOriginalBytes - totalOptimizedBytes);
  const overallReduction = totalOriginalBytes > 0
    ? (((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1)
    : '0.0';

  console.log('');
  console.log(`  ${c.border}${'─'.repeat(80)}${c.reset}`);
  console.log(
    `  ${c.green}✓ Done${c.reset} ${c.muted}·${c.reset} ${c.foreground}${optimized} optimized${c.reset} ${c.muted}·${c.reset} ${c.muted}${errors} error${errors === 1 ? '' : 's'}${c.reset} ${c.muted}·${c.reset} ${c.green}${overallReduction}% total reduction${c.reset} ${c.muted}(${formatSize(bytesSaved)} saved)${c.reset}`
  );
  console.log('');
}

// ── Server mode ────────────────────────────────────────────────────────────────

function runServer() {
  const app = require('../src/app');
  const PORT = process.env.PORT || 3000;

  printHeader();
  console.log(`  ${c.cyan}● Server running on port ${PORT}${c.reset}`);
  console.log(`  ${c.muted}● POST /optimize to process files${c.reset}`);
  console.log(`  ${c.muted}● GET /metrics for real-time ROI telemetry${c.reset}`);
  console.log('');

  app.listen(PORT);
}

// ── Entry point ────────────────────────────────────────────────────────────────

const [, , subcommand, ...rest] = process.argv;

if (subcommand === 'optimize') {
  runOptimize(rest).catch((err) => {
    console.error(`  ${c.red}✗ Fatal: ${err.message}${c.reset}`);
    process.exitCode = 1;
  });
} else {
  runServer();
}
