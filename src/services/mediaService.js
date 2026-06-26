const ffmpegStatic = require('ffmpeg-static');
const { spawn } = require('child_process');
const { Readable, PassThrough } = require('stream');
const os = require('os');
const path = require('path');
const fs = require('fs');

async function extractVideoThumbnail(buffer) {
  return new Promise((resolve, reject) => {
    const inputStream = Readable.from(buffer);
    const args = [
      '-i', 'pipe:0',
      '-vframes', '1',
      '-f', 'image2',
      '-c:v', 'webp',
      'pipe:1',
    ];

    const ffmpegProcess = spawn(ffmpegStatic, args);
    const outChunks = [];

    ffmpegProcess.stdout.on('data', chunk => outChunks.push(chunk));

    ffmpegProcess.on('error', err => reject(err));
    ffmpegProcess.on('close', code => {
      if (code === 0) {
        resolve({ buffer: Buffer.concat(outChunks), outMime: 'image/webp' });
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    inputStream.pipe(ffmpegProcess.stdin);
  });
}

function optimizeMediaStream(buffer, mimeType, method, options = {}) {
  const isExtreme = method === 'extreme';
  const isBalanced = method === 'balanced';
  const isVideo = mimeType.startsWith('video/');

  // Create an in-memory readable stream from the buffer
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
      // For standard MP4 faststart (moov atom at beginning), FFmpeg requires disk seeking.
      args.push('-movflags', 'faststart');
      tempPath = path.join(os.tmpdir(), `condense_${Date.now()}_${Math.random().toString(36).substring(7)}.mp4`);
    } else {
      // Critical for streaming MP4 out of memory: frag_keyframe + empty_moov
      args.push('-movflags', 'frag_keyframe+empty_moov');
    }

    if (isExtreme) {
      args.push('-vf', 'scale=480:-1'); // Maximum width 480p, keeps aspect ratio
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
  } else {
    outMime = 'audio/mpeg'; // Unify audio output to standard mp3
    args.push('-f', 'mp3');

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

  // Spawn FFmpeg process with direct CLI invocation
  const ffmpegProcess = spawn(ffmpegStatic, args);

  // Attach error handlers to prevent silent hanging
  ffmpegProcess.on('error', (err) => {
    outputStream.emit('error', new Error(`FFmpeg processing failed: ${err.message}`));
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlink(tempPath, () => {});
    }
  });

  // Handle non-zero exit codes
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

  // Pipe the input stream to FFmpeg stdin and FFmpeg stdout to our memory passthrough stream
  inputStream.pipe(ffmpegProcess.stdin);

  if (!tempPath) {
    ffmpegProcess.stdout.pipe(outputStream);
  }

  return { stream: outputStream, outMime };
}

module.exports = { optimizeMediaStream, extractVideoThumbnail };