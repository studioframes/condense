'use strict';

const ffmpegStatic = require('ffmpeg-static');
const { spawn } = require('child_process');
const { Readable, PassThrough } = require('stream');
const os = require('os');
const path = require('path');
const fs = require('fs');

/**
 * Extracts the first frame of a video as a WebP image thumbnail.
 */
async function extractVideoThumbnail(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const inputStream = Readable.from(buffer);
    const args = ['-i', 'pipe:0', '-vframes', '1'];

    if (options.width || options.height) {
      const w = options.width || -1;
      const h = options.height || -1;
      args.push('-vf', `scale=${w}:${h}`);
    }

    args.push('-f', 'image2', '-c:v', 'webp', 'pipe:1');

    const ffmpegProcess = spawn(ffmpegStatic, args);
    const outChunks = [];

    ffmpegProcess.stdout.on('data', (chunk) => outChunks.push(chunk));
    ffmpegProcess.on('error', (err) => reject(err));
    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve({ buffer: Buffer.concat(outChunks), outMime: 'image/webp' });
      } else {
        reject(new Error(`FFmpeg thumbnail extraction exited with code ${code}`));
      }
    });

    inputStream.pipe(ffmpegProcess.stdin);
  });
}

/**
 * Optimizes an audio or video stream completely in memory, with support for
 * EBU R128 loudness normalization, smart encoding presets, and animated conversions.
 */
function optimizeMediaStream(buffer, mimeType, method = 'quality', options = {}) {
  const isExtreme = method === 'extreme';
  const isBalanced = method === 'balanced';
  const isVideo = mimeType.startsWith('video/');
  const isAudio = mimeType.startsWith('audio/');

  // Create in-memory readable stream
  const inputStream = Readable.from(buffer);
  const outputStream = new PassThrough();

  let outMime = mimeType;
  const args = ['-i', 'pipe:0'];
  let tempPath = null;

  if (isVideo) {
    outMime = 'video/mp4';
    args.push('-f', 'mp4');
    args.push('-c:v', 'libx264');

    if (options.faststart) {
      // For standard MP4 faststart (moov atom at start), FFmpeg requires disk seeking.
      args.push('-movflags', 'faststart');
      tempPath = path.join(
        os.tmpdir(),
        `condense_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`
      );
    } else {
      // Critical for streaming MP4 out of memory: frag_keyframe + empty_moov
      args.push('-movflags', 'frag_keyframe+empty_moov');
    }

    // Video filters (scaling, FPS limit)
    const videoFilters = [];
    if (options.width || options.height) {
      const w = options.width || -1;
      const h = options.height || -1;
      videoFilters.push(`scale=${w}:${h}`);
    } else if (isExtreme) {
      videoFilters.push('scale=480:-2'); // Keep divisible by 2 for H.264
    } else if (isBalanced && !options.width) {
      videoFilters.push('scale=720:-2');
    }

    if (options.fps) {
      videoFilters.push(`fps=${options.fps}`);
    }

    if (videoFilters.length > 0) {
      args.push('-vf', videoFilters.join(','));
    }

    // Audio filters (normalization)
    const audioFilters = [];
    if (options.normalizeAudio || options.loudnorm) {
      audioFilters.push('loudnorm=I=-16:TP=-1.5:LRA=11');
    }
    if (audioFilters.length > 0) {
      args.push('-af', audioFilters.join(','));
    }

    // Compression quality
    if (isExtreme) {
      args.push('-crf', '30');
      args.push('-b:a', '64k');
      args.push('-ac', '1'); // Mono
    } else if (isBalanced) {
      args.push('-crf', '26');
      args.push('-b:a', '96k');
      args.push('-ac', '2'); // Stereo
    } else {
      args.push('-crf', '23');
      args.push('-b:a', '128k');
      args.push('-ac', '2'); // Stereo
    }
  } else if (isAudio) {
    outMime = 'audio/mpeg'; // Standard MP3 output
    args.push('-f', 'mp3');

    // EBU R128 Loudness Normalization for audio podcasts / speech
    const audioFilters = [];
    if (options.normalizeAudio || options.loudnorm) {
      audioFilters.push('loudnorm=I=-16:TP=-1.5:LRA=11');
    }
    if (audioFilters.length > 0) {
      args.push('-af', audioFilters.join(','));
    }

    if (isExtreme) {
      args.push('-b:a', '64k');
      args.push('-ac', '1');
    } else if (isBalanced) {
      args.push('-b:a', '96k');
      args.push('-ac', '2');
    } else {
      args.push('-b:a', '128k');
      args.push('-ac', '2');
    }
  }

  if (tempPath) {
    args.push('-y', tempPath);
  } else {
    args.push('pipe:1');
  }

  // Spawn FFmpeg process
  const ffmpegProcess = spawn(ffmpegStatic, args);

  // Attach error handlers
  ffmpegProcess.on('error', (err) => {
    outputStream.emit('error', new Error(`FFmpeg processing failed: ${err.message}`));
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlink(tempPath, () => {});
    }
  });

  // Handle process completion / exit code
  ffmpegProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      outputStream.emit('error', new Error(`FFmpeg exited with code ${code}`));
      if (tempPath && fs.existsSync(tempPath)) {
        fs.unlink(tempPath, () => {});
      }
    } else if (tempPath) {
      const readStream = fs.createReadStream(tempPath);
      readStream.on('end', () => fs.unlink(tempPath, () => {}));
      readStream.on('error', (err) => {
        outputStream.emit('error', err);
        fs.unlink(tempPath, () => {});
      });
      readStream.pipe(outputStream);
    }
  });

  // Pipe input to FFmpeg stdin
  inputStream.pipe(ffmpegProcess.stdin);

  if (!tempPath) {
    ffmpegProcess.stdout.pipe(outputStream);
  }

  return { stream: outputStream, outMime };
}

module.exports = {
  optimizeMediaStream,
  extractVideoThumbnail,
};
