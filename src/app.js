const express = require('express');
const optimizeController = require('./controllers/optimizeController');
const upload = require('./middleware/upload');

const app = express();

// Strict Timeout Middleware (30 seconds)
app.use((req, res, next) => {
    const TIMEOUT_MS = 30000;
    req.setTimeout(TIMEOUT_MS, () => {
        const err = new Error('Request Timeout: Upload took too long.');
        err.status = 408;
        next(err);
    });
    res.setTimeout(TIMEOUT_MS, () => {
        if (!res.headersSent) {
            const err = new Error('Response Timeout: Processing took too long.');
            err.status = 503;
            next(err);
        }
    });
    next();
});

// Primary Endpoint (Exposed as standard router path)
app.post('/optimize', upload.single('file'), optimizeController.optimizeFile);

// Global Error Handler
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 50MB.' });
    }
    if (!res.headersSent) {
        res.status(err.status || 500).json({ 
            error: err.message || 'Internal Server Error' 
        });
    } else {
        res.end();
    }
});

module.exports = app;