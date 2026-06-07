const { optimizeText } = require('../services/textService');
const { optimizeImage } = require('../services/imageService');
const { optimizeMediaStream } = require('../services/mediaService');

const TEXT_MIMES = ['application/javascript', 'text/javascript', 'text/css', 'application/json', 'text/html'];
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const MEDIA_MIMES = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'video/mp4'];

async function optimizeFile(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded in the "file" field.' });
        }

        const method = req.body.method === 'extreme' ? 'extreme' : 'quality'; // Defaults to quality
        const mimeType = req.file.mimetype;
        const fileBuffer = req.file.buffer;

        // 1. TEXT / CODE
        if (TEXT_MIMES.includes(mimeType)) {
            const { buffer, outMime } = await optimizeText(fileBuffer, mimeType, method);
            res.setHeader('Content-Type', outMime);
            res.setHeader('Content-Length', buffer.length);
            return res.send(buffer); // Instantly drops to response stream natively
        }
        
        // 2. IMAGES
        if (IMAGE_MIMES.includes(mimeType)) {
            const { buffer, outMime } = await optimizeImage(fileBuffer, mimeType, method);
            res.setHeader('Content-Type', outMime);
            res.setHeader('Content-Length', buffer.length);
            return res.send(buffer);
        }

        // 3. AUDIO / VIDEO (Handles Stream Piping)
        if (MEDIA_MIMES.includes(mimeType)) {
            const { stream, outMime } = optimizeMediaStream(fileBuffer, mimeType, method);
            res.setHeader('Content-Type', outMime);
            res.setHeader('Transfer-Encoding', 'chunked'); // Required for streaming processed video
            
            stream.on('error', (err) => {
                if (!res.headersSent) {
                    next(err);
                } else {
                    res.end(); // If it errors mid-stream, safely terminate the HTTP connection
                }
            });

            // Pipe output stream identically into response stream instantly
            return stream.pipe(res);
        }

        // 4. FALLBACK
        return res.status(400).json({ 
            error: 'Unsupported file type. Supported: JS, CSS, JSON, JPG, PNG, WebP, MP3, WAV, MP4.' 
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { optimizeFile };