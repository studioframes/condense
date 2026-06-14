import { Express } from 'express';
import { Readable } from 'stream';

/**
 * Result from media stream optimization
 */
export interface MediaStreamResult {
  /**
   * Readable stream of optimized media output
   */
  stream: Readable;
  /**
   * MIME type of output (e.g., 'audio/mpeg', 'video/mp4')
   */
  outMime: string;
}

/**
 * Result from image/text buffer optimization
 */
export interface OptimizationResult {
  /**
   * Optimized buffer output
   */
  buffer: Buffer;
  /**
   * MIME type of output
   */
  outMime: string;
}

/**
 * Optimization strategy: visually lossless or aggressive compression
 */
export type OptimizationMethod = 'quality' | 'extreme';

/**
 * Optimize an image buffer (PNG, JPEG, WebP)
 * @param buffer - Input image buffer
 * @param mimeType - Image MIME type ('image/png', 'image/jpeg', 'image/webp')
 * @param method - Optimization method ('quality' for lossless, 'extreme' for aggressive)
 * @returns Promise<OptimizationResult> with optimized buffer and output MIME type
 * @example
 * const { optimizeImage } = require('@studioframes/condense');
 * const result = await optimizeImage(imageBuffer, 'image/png', 'quality');
 */
export function optimizeImage(
  buffer: Buffer,
  mimeType: string,
  method: OptimizationMethod
): Promise<OptimizationResult>;

/**
 * Optimize text/code (HTML, CSS, JavaScript, JSON)
 * @param buffer - Input text buffer
 * @param mimeType - Text MIME type ('text/html', 'text/css', 'application/javascript', 'application/json')
 * @param method - Optimization method ('quality' for lossless, 'extreme' for aggressive)
 * @returns Promise<OptimizationResult> with optimized buffer and output MIME type
 * @example
 * const { optimizeText } = require('@studioframes/condense');
 * const result = await optimizeText(htmlBuffer, 'text/html', 'quality');
 */
export function optimizeText(
  buffer: Buffer,
  mimeType: string,
  method: OptimizationMethod
): Promise<OptimizationResult>;

/**
 * Optimize media streams (MP4, MP3, WAV)
 * @param buffer - Input media buffer
 * @param mimeType - Media MIME type ('video/mp4', 'audio/mpeg', 'audio/wav')
 * @param method - Optimization method ('quality' or 'extreme')
 * @returns MediaStreamResult with readable stream and output MIME type
 * @example
 * const { optimizeMediaStream } = require('@studioframes/condense');
 * const { stream } = optimizeMediaStream(videoBuffer, 'video/mp4', 'quality');
 * stream.pipe(res);
 */
export function optimizeMediaStream(
  buffer: Buffer,
  mimeType: string,
  method: OptimizationMethod
): MediaStreamResult;

/**
 * Express sub-application with file optimization routes
 * @example
 * const express = require('express');
 * const { condenseApp } = require('@studioframes/condense');
 * const app = express();
 * app.use('/optimize', condenseApp);
 */
export const condenseApp: Express;
