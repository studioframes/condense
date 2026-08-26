# Multi-Threaded Worker Pool Guide

Node.js is single-threaded by default for JavaScript execution. When processing large batches of images, videos, or archives, running all transformations on the main event loop can cause CPU blocking and latency spikes.

Condense v1.0.0 includes a dedicated, zero-dependency `WorkerPool` built directly on Node.js `worker_threads` to offload intensive tasks to background worker threads.

---

## 1. How the Worker Pool Operates

1. **Thread Spawning**: The pool maintains a configurable number of background worker threads.
2. **Task Queue**: Inbound tasks (`optimizeImage`, `optimizeText`, `optimizeZip`, etc.) are queued and dispatched to the first available idle worker.
3. **Pure Memory Transfer**: Buffers are transferred cleanly between threads.
4. **Graceful Fallback**: In restricted or single-threaded environments, the pool automatically falls back to asynchronous execution on the main thread without throwing errors.

---

## 2. Using the Shared Singleton Pool

The easiest way to utilize worker threads is via `getWorkerPool()`:

```javascript
const { getWorkerPool } = require('@studioframes/condense');

// Retrieves or initializes the shared pool
const pool = getWorkerPool({ maxWorkers: 4 });

// Execute tasks concurrently across worker threads
const result = await pool.execute('optimizeImage', {
  buffer: rawImageBuffer,
  mimeType: 'image/jpeg',
  method: 'balanced',
});

console.log(`Optimized image buffer: ${result.buffer.length} bytes`);
```

---

## 3. Instantiating a Custom `WorkerPool`

For isolated workloads or specific service boundaries, you can instantiate dedicated pools:

```javascript
const { WorkerPool } = require('@studioframes/condense');

const customPool = new WorkerPool({
  maxWorkers: 8,           // Maximum concurrent worker threads
  idleTimeoutMs: 30000,    // Worker idle termination timeout
});

// Dispatch batch items
const fileBuffers = [/* Array of raw image buffers */];

const batchPromises = fileBuffers.map(buf =>
  customPool.execute('optimizeImage', {
    buffer: buf,
    mimeType: 'image/png',
    method: 'extreme',
  })
);

const optimizedFiles = await Promise.all(batchPromises);

// Gracefully terminate the pool when finished
await customPool.terminate();
```

---

## 4. Supported Worker Task Types

The `WorkerPool` supports all primary Condense task types:

- **`'optimizeImage'`**: Delegates raster and vector image optimizations (Sharp, SVGO, resizing).
- **`'optimizeText'`**: Minifies HTML, CSS, JavaScript, TypeScript, XML, YAML, and GraphQL.
- **`'optimizePerceptualImage'`**: Runs perceptual SSIM binary-search quality tuning.
- **`'optimizeZip'`**: Recursively decompresses and optimizes ZIP archives.
- **`'optimizeFont'`**: Strips discardable SFNT/WOFF font tables.
- **`'optimizePdf'`**: Minifies PDF metadata and stream objects.

---

## 5. Configuration via Environment Variables

You can control default worker thread sizing using environment variables:

```bash
# Sets the default pool capacity across the application
export CONDENSE_WORKERS=4
```
