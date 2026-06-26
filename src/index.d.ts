import { Express } from 'express';
import { Readable } from 'stream';

export interface MediaStreamResult {
  stream: Readable;
  outMime: string;
}

export interface OptimizationResult {
  buffer: Buffer;
  outMime: string;
}

export type OptimizationMethod = 'quality' | 'balanced' | 'extreme';

export interface ImageOptions {
  width?: string | number;
  height?: string | number;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  keepMetadata?: boolean;
  keepFormat?: boolean;
  targetFormat?: 'webp' | 'avif';
}

export interface MediaOptions {
  faststart?: boolean;
}

export function optimizeImage(
  buffer: Buffer,
  mimeType: string,
  method: OptimizationMethod,
  options?: ImageOptions
): Promise<OptimizationResult>;

export function optimizeText(
  buffer: Buffer,
  mimeType: string,
  method: OptimizationMethod
): Promise<OptimizationResult>;

export function optimizeMediaStream(
  buffer: Buffer,
  mimeType: string,
  method: OptimizationMethod,
  options?: MediaOptions
): MediaStreamResult;

export function extractVideoThumbnail(
  buffer: Buffer
): Promise<OptimizationResult>;

export function optimizeEsbuild(
  buffer: Buffer,
  ext: string,
  method: OptimizationMethod
): Promise<OptimizationResult>;

export function optimizeWasm(
  buffer: Buffer,
  method: OptimizationMethod
): Promise<OptimizationResult>;

export const condenseApp: Express;
