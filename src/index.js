const app = require('./app');
const { optimizeText } = require('./services/textService');
const { optimizeImage } = require('./services/imageService');
const { optimizeMediaStream } = require('./services/mediaService');

module.exports = {
    // 1. As an Express sub-application/router
    condenseApp: app,
    
    // 2. Or as programmatic helper utilities
    optimizeText,
    optimizeImage,
    optimizeMediaStream
};