/**
 * Example: Using Condense as a Programmatic SDK
 * Import individual functions for direct buffer processing
 */

const fs = require('fs');
const {
  optimizeImage,
  optimizeText,
  optimizeMediaStream
} = require('../src/index');

async function exampleImageOptimization() {
  console.log('📸 Image Optimization Example');
  
  // In real usage, you'd read an actual image file
  const imageBuffer = Buffer.from([/* image data */]);
  const result = await optimizeImage(imageBuffer, 'image/png', 'quality');
  
  console.log(`  Input size: ${imageBuffer.length} bytes`);
  console.log(`  Output size: ${result.buffer.length} bytes`);
  console.log(`  Output MIME: ${result.outMime}\n`);
  
  return result.buffer;
}

async function exampleTextOptimization() {
  console.log('📝 Text Optimization Example');
  
  const htmlCode = `
    <html>
      <body>
        <h1>  Hello World  </h1>
        <p>This   is   minified</p>
      </body>
    </html>
  `;
  
  const htmlBuffer = Buffer.from(htmlCode);
  const result = await optimizeText(htmlBuffer, 'text/html', 'quality');
  
  console.log(`  Input size: ${htmlBuffer.length} bytes`);
  console.log(`  Output size: ${result.buffer.length} bytes`);
  console.log(`  Output: ${result.buffer.toString().substring(0, 60)}...\n`);
  
  return result.buffer;
}

function exampleMediaStreaming() {
  console.log('🎬 Media Streaming Example');
  
  // In real usage, you'd read an actual video/audio file
  const mediaBuffer = Buffer.from([/* media data */]);
  const { stream, outMime } = optimizeMediaStream(mediaBuffer, 'audio/mpeg', 'quality');
  
  console.log(`  Output MIME: ${outMime}`);
  console.log(`  Stream type: ${stream.constructor.name}`);
  console.log(`  Stream ready to pipe to HTTP response\n`);
  
  // Example: pipe to HTTP response
  // stream.pipe(res);
}

// Run all examples
async function main() {
  console.log('🎯 Condense SDK Examples\n');
  console.log('='.repeat(50));
  console.log();
  
  try {
    await exampleImageOptimization();
    await exampleTextOptimization();
    exampleMediaStreaming();
    
    console.log('✅ All examples completed');
    console.log('\nFor production, read files from disk/network:');
    console.log('  const buffer = await fs.promises.readFile(path)');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
