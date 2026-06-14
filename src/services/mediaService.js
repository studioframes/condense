const ffmpegStatic = require('ffmpeg-static');
const { spawn } = require('child_process');
const { Readable, PassThrough } = require('stream');

function optimizeMediaStream(buffer, mimeType, method) {
    const isExtreme = method === 'extreme';
    const isVideo = mimeType.startsWith('video/');
    
    // Create an in-memory readable stream from the buffer
    const inputStream = Readable.from(buffer);
    const outputStream = new PassThrough();
    
    let outMime = mimeType;
    const args = ['-i', 'pipe:0'];

    if (isVideo) {
        outMime = 'video/mp4';
        
        // Critical for streaming MP4 out of memory: frag_keyframe + empty_moov
        args.push('-f', 'mp4');
        args.push('-c:v', 'libx264');
        args.push('-movflags', 'frag_keyframe+empty_moov');

        if (isExtreme) {
            args.push('-vf', 'scale=480:-1'); // Maximum width 480p, keeps aspect ratio
            args.push('-crf', '30');
            args.push('-b:a', '64k');
            args.push('-ac', '1'); // Mono
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
        } else {
            args.push('-b:a', '128k');
            args.push('-ac', '2');
        }
    }

    args.push('pipe:1');

    // Spawn FFmpeg process with direct CLI invocation
    const ffmpegProcess = spawn(ffmpegStatic, args);
    
    // Attach error handlers to prevent silent hanging
    ffmpegProcess.on('error', (err) => {
        outputStream.emit('error', new Error(`FFmpeg processing failed: ${err.message}`));
    });

    // Handle non-zero exit codes
    ffmpegProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
            outputStream.emit('error', new Error(`FFmpeg exited with code ${code}`));
        }
    });

    // Pipe the input stream to FFmpeg stdin and FFmpeg stdout to our memory passthrough stream
    inputStream.pipe(ffmpegProcess.stdin);
    ffmpegProcess.stdout.pipe(outputStream);

    return { stream: outputStream, outMime };
}

module.exports = { optimizeMediaStream };