const multer = require('multer');

const storage = multer.memoryStorage();

// Limit strictly to 50MB to prevent memory exhaustion
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB in bytes
    }
});

module.exports = upload;