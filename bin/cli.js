#!/usr/bin/env node

const app = require('../src/app');
const PORT = process.env.PORT || 3000;

console.log('⚡ Starting Condense API...');
app.listen(PORT, () => {
    console.log(`⚡ Condense standalone server is running in-memory on port ${PORT}`);
});