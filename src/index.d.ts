import { Express } from 'express';
import { Readable, Transform } from 'stream';

export type OptimizationMethod = 'quality' | 'balanced' | 'extreme';

export interface OptimizationResult {
  buffer: Buffer;
  outMime: string;
  stats?: Record<string, any>;
}

export interface MediaStreamResult {
  stream: Readable;
  outMime: string;
}

export interface ImageOptions {
  width?: string | number;
  height?: string | number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  gravity?: 'entropy' | 'attention' | 'center' | 'north' | 'south' | 'east' | 'west' | string;
  cropStrategy?: 'entropy' | 'attention' | 'saliency' | string;
  keepMetadata?: boolean;
  keepFormat?: boolean;
  targetFormat?: 'webp' | 'avif' | 'jpeg' | 'png';
  perceptual?: boolean;
  targetSSIM?: number;
  minQuality?: number;
  maxQuality?: number;
}

export interface PerceptualImageResult extends OptimizationResult {
  quality: number;
  ssim: number;
  savingsPercent: number;
}

export interface ResponsiveVariant {
  format: string;
  mimeType: string;
  width: number;
  height: number;
  size: number;
  buffer: Buffer;
  descriptor: string;
}

export interface ResponsiveMatrixResult {
  original: {
    width: number;
    height: number;
    size: number;
    mimeType: string;
  };
  variants: ResponsiveVariant[];
}

export interface MediaOptions {
  faststart?: boolean;
  normalizeAudio?: boolean;
  loudnorm?: boolean;
  width?: number;
  height?: number;
  fps?: number;
}

export interface ArchiveOptions {
  method?: OptimizationMethod;
  keepFormat?: boolean;
  ignorePatterns?: string[];
}

export interface FontOptions {
  method?: OptimizationMethod;
  stripTables?: string[];
}

export interface PdfOptions {
  method?: OptimizationMethod;
}

export interface SvgItem {
  id?: string;
  svg?: string | Buffer;
  content?: string;
}

export interface SvgSpriteResult {
  buffer: Buffer;
  outMime: string;
  symbolIds: string[];
  stats: {
    count: number;
    originalSize: number;
    packedSize: number;
    savings: number;
  };
}

export interface TokenMangleBundle {
  html?: string | Buffer;
  css?: string | Buffer;
  js?: string | Buffer;
}

export interface TokenMangleResult {
  html: Buffer | null;
  css: Buffer | null;
  js: Buffer | null;
  tokenMap: {
    classes: Record<string, string>;
    ids: Record<string, string>;
  };
  stats: {
    originalSize: number;
    mangledSize: number;
    savingsPercent: number;
    classesMangled: number;
    idsMangled: number;
  };
}

export interface SSIMResult {
  ssim: number;
  mssim: number;
  score: number;
}

export interface PSNRResult {
  psnr: number;
  mse: number;
}

export interface PresetConfig {
  description: string;
  category: string;
  method: OptimizationMethod;
  options: Record<string, any>;
  builtIn?: boolean;
}

export interface TelemetryMetrics {
  uptimeSeconds: number;
  totalRequests: number;
  totalFiles: number;
  totalBytesIn: number;
  totalBytesOut: number;
  totalBytesSaved: number;
  overallReductionPercent: number;
  throughputMBps: number;
  roi: {
    estimatedBandwidthSavedGB: number;
    estimatedCostSavingsUSD: number;
    estimatedCo2SavedGrams: number;
  };
  categories: Record<string, any>;
  recentEvents: any[];
}

export declare class CondensePipeline {
  constructor(options?: Record<string, any>);
  preset(name: string, overrides?: Record<string, any>): this;
  method(mode: OptimizationMethod): this;
  resize(resizeOptions: { width?: number; height?: number; fit?: string; gravity?: string }): this;
  convert(targetFormat: 'webp' | 'avif' | 'jpeg' | 'png'): this;
  perceptual(perceptualOptions?: { targetSSIM?: number }): this;
  image(imgOptions?: ImageOptions): this;
  text(textOptions?: Record<string, any>): this;
  wasm(wasmOptions?: Record<string, any>): this;
  archive(archiveOptions?: ArchiveOptions): this;
  process(inputBuffer: Buffer | Uint8Array, mimeOrPath?: string): Promise<OptimizationResult>;
  stream(mimeOrExt?: string): Transform;
}

export declare class WorkerPool {
  constructor(poolSize?: number);
  runTask(taskData: Record<string, any>): Promise<any>;
  destroy(): void;
}

export function optimizeImage(
  buffer: Buffer,
  mimeType: string,
  method?: OptimizationMethod,
  options?: ImageOptions
): Promise<OptimizationResult>;

export function optimizePerceptualImage(
  buffer: Buffer,
  mimeType: string,
  options?: ImageOptions
): Promise<PerceptualImageResult>;

export function generateResponsiveMatrix(
  buffer: Buffer,
  mimeType: string,
  options?: { widths?: number[]; formats?: string[]; method?: OptimizationMethod; fit?: string; cropStrategy?: string }
): Promise<ResponsiveMatrixResult>;

export function generatePictureHtml(
  matrixResult: ResponsiveMatrixResult,
  htmlOptions?: { alt?: string; className?: string; sizes?: string; loading?: string }
): string;

export function optimizeText(
  buffer: Buffer,
  mimeType: string,
  method?: OptimizationMethod
): Promise<OptimizationResult>;

export function optimizeMediaStream(
  buffer: Buffer,
  mimeType: string,
  method?: OptimizationMethod,
  options?: MediaOptions
): MediaStreamResult;

export function extractVideoThumbnail(
  buffer: Buffer,
  options?: { width?: number; height?: number }
): Promise<OptimizationResult>;

export function optimizeEsbuild(
  buffer: Buffer,
  ext: string,
  method?: OptimizationMethod
): Promise<OptimizationResult>;

export function optimizeWasm(
  buffer: Buffer,
  method?: OptimizationMethod
): OptimizationResult;

export function optimizeZip(
  zipBuffer: Buffer | Uint8Array,
  options?: ArchiveOptions
): Promise<OptimizationResult>;

export function optimizeFont(
  fontBuffer: Buffer,
  options?: FontOptions
): OptimizationResult;

export function optimizePdf(
  pdfBuffer: Buffer,
  options?: PdfOptions
): OptimizationResult;

export function packSvgSprites(
  items: SvgItem[] | Record<string, string | Buffer>,
  options?: { method?: OptimizationMethod; prefix?: string }
): Promise<SvgSpriteResult>;

export function mangleTokens(
  bundle: TokenMangleBundle,
  options?: { preservePatterns?: RegExp[]; reservedTokens?: string[]; prefix?: string }
): TokenMangleResult;

export function calculateSSIM(
  rawBufferA: Buffer,
  rawBufferB: Buffer,
  options: { width: number; height: number; channels?: number; windowSize?: number }
): SSIMResult;

export function calculatePSNR(
  rawBufferA: Buffer,
  rawBufferB: Buffer,
  channels?: number
): PSNRResult;

export function createPipeline(options?: Record<string, any>): CondensePipeline;

export function registerPreset(name: string, config: PresetConfig): void;
export function getPreset(name: string): PresetConfig | null;
export function listPresets(): Record<string, PresetConfig>;

export function getWorkerPool(): WorkerPool;

export interface Telemetry {
  record(category: string, bytesIn: number, bytesOut: number, durationMs?: number, metadata?: Record<string, any>): void;
  getMetrics(): TelemetryMetrics;
  reset(): void;
}

export const telemetry: Telemetry;
export const condenseApp: Express;

export function condense(options?: Record<string, any>): CondensePipeline;
export default condense;
