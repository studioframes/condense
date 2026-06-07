const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');
const ffmpeg = require('fluent-ffmpeg');
const { Readable, PassThrough } = require('stream');

ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);

function optimizeMediaStream(buffer, mimeType, method) {
    const isExtreme = method === 'extreme';
    const isVideo = mimeType.startsWith('video/');
    
    // Create an in-memory readable stream from the buffer
    const inputStream = Readable.from(buffer);
    const outputStream = new PassThrough();
    
    let command = ffmpeg(inputStream);
    let outMime = mimeType;

    if (isVideo) {
        outMime = 'video/mp4';
        
        // Critical for streaming MP4 out of memory: frag_keyframe + empty_moov
        command = command
            .format('mp4')
            .videoCodec('libx264')
            .outputOptions(['-movflags frag_keyframe+empty_moov']);

        if (isExtreme) {
            command = command
                .size('480x?') // Maximum width 480p, keeps aspect ratio natively
                .outputOptions('-crf 30')
                .audioBitrate('64k')
                .audioChannels(1); // Mono
        } else {
            command = command
                .outputOptions('-crf 23')
                .audioBitrate('128k')
                .audioChannels(2); // Stereo
        }
    } else {
        outMime = 'audio/mpeg'; // Unify audio output to standard mp3
        command = command.format('mp3');

        if (isExtreme) {
            command = command.audioBitrate('64k').audioChannels(1);
        } else {
            command = command.audioBitrate('128k').audioChannels(2);
        }
    }

    // Attach stream error handlers to prevent silent hanging
    command.on('error', (err) => {
        outputStream.emit('error', new Error(`FFmpeg processing failed: ${err.message}`));
    });

    // Pipe the standard output from FFmpeg directly to our memory passthrough stream
    command.pipe(outputStream);

    return { stream: outputStream, outMime };
}

module.exports = { optimizeMediaStream };