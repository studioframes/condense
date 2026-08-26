'use strict';

const { Worker, isMainThread, parentPort } = require('worker_threads');
const os = require('os');

/**
 * Worker thread execution handler (when running inside worker thread)
 */
if (!isMainThread && parentPort) {
  const { optimizeImage, optimizePerceptualImage } = require('./imageService');
  const { optimizeText } = require('./textService');
  const { optimizeEsbuild } = require('./esbuildService');
  const { optimizeWasm } = require('./wasmService');
  const { optimizeZip } = require('./archiveService');

  parentPort.on('message', async (task) => {
    const { taskId, type, buffer, mimeType, method, options, ext } = task;
    try {
      let result;
      const buf = Buffer.from(buffer);

      if (type === 'image') {
        result = await optimizeImage(buf, mimeType, method, options);
      } else if (type === 'perceptual-image') {
        result = await optimizePerceptualImage(buf, mimeType, options);
      } else if (type === 'text') {
        result = await optimizeText(buf, mimeType, method);
      } else if (type === 'esbuild') {
        result = await optimizeEsbuild(buf, ext, method);
      } else if (type === 'wasm') {
        result = optimizeWasm(buf, method);
      } else if (type === 'archive') {
        result = await optimizeZip(buf, options);
      } else {
        throw new Error(`Unknown task type: ${type}`);
      }

      parentPort.postMessage({ taskId, success: true, result });
    } catch (err) {
      parentPort.postMessage({ taskId, success: false, error: err.message });
    }
  });
}

/**
 * WorkerPool manages a pool of background worker threads.
 */
class WorkerPool {
  constructor(poolSize = Math.max(1, Math.min(4, os.cpus().length))) {
    this.poolSize = poolSize;
    this.workers = [];
    this.freeWorkers = [];
    this.queue = [];
    this.taskIdCounter = 0;
    this.pendingTasks = new Map();
    this.isDestroyed = false;

    if (isMainThread) {
      this._initWorkers();
    }
  }

  _initWorkers() {
    for (let i = 0; i < this.poolSize; i++) {
      try {
        const worker = new Worker(__filename);
        worker.unref(); // Don't hold open process
        worker.on('message', (msg) => this._onWorkerMessage(worker, msg));
        worker.on('error', (err) => this._onWorkerError(worker, err));
        worker.on('exit', () => this._onWorkerExit(worker));
        this.workers.push(worker);
        this.freeWorkers.push(worker);
      } catch {
        // Fallback for restricted environments
      }
    }
  }

  _onWorkerMessage(worker, msg) {
    worker.unref();
    const { taskId, success, result, error } = msg;
    const pending = this.pendingTasks.get(taskId);
    if (pending) {
      this.pendingTasks.delete(taskId);
      if (success) {
        if (result && result.buffer) {
          result.buffer = Buffer.from(result.buffer);
        }
        pending.resolve(result);
      } else {
        pending.reject(new Error(error));
      }
    }
    this.freeWorkers.push(worker);
    this._processNext();
  }

  _onWorkerError(worker, _err) {
    const idx = this.workers.indexOf(worker);
    if (idx !== -1) {
      this.workers.splice(idx, 1);
    }
    const freeIdx = this.freeWorkers.indexOf(worker);
    if (freeIdx !== -1) {
      this.freeWorkers.splice(freeIdx, 1);
    }
    if (!this.isDestroyed) {
      try {
        const newWorker = new Worker(__filename);
        newWorker.unref();
        newWorker.on('message', (msg) => this._onWorkerMessage(newWorker, msg));
        newWorker.on('error', (e) => this._onWorkerError(newWorker, e));
        newWorker.on('exit', () => this._onWorkerExit(newWorker));
        this.workers.push(newWorker);
        this.freeWorkers.push(newWorker);
        this._processNext();
      } catch {}
    }
  }

  _onWorkerExit(worker) {
    this._onWorkerError(worker, new Error('Worker exited unexpectedly'));
  }

  _processNext() {
    if (this.queue.length === 0 || this.freeWorkers.length === 0) return;
    const task = this.queue.shift();
    const worker = this.freeWorkers.shift();
    worker.ref();
    worker.postMessage(task);
  }

  /**
   * Dispatches a task to the worker pool.
   */
  async runTask(taskData) {
    if (this.isDestroyed || this.workers.length === 0) {
      return this._runDirect(taskData);
    }

    return new Promise((resolve, reject) => {
      const taskId = ++this.taskIdCounter;
      this.pendingTasks.set(taskId, {
        resolve: (res) => {
          if (res && res.buffer) res.buffer = Buffer.from(res.buffer);
          resolve(res);
        },
        reject,
      });
      this.queue.push({ taskId, ...taskData });
      this._processNext();
    });
  }

  async _runDirect(task) {
    const { type, buffer, mimeType, method, options, ext } = task;
    const { optimizeImage, optimizePerceptualImage } = require('./imageService');
    const { optimizeText } = require('./textService');
    const { optimizeEsbuild } = require('./esbuildService');
    const { optimizeWasm } = require('./wasmService');
    const { optimizeZip } = require('./archiveService');

    const buf = Buffer.from(buffer);
    if (type === 'image') return optimizeImage(buf, mimeType, method, options);
    if (type === 'perceptual-image') return optimizePerceptualImage(buf, mimeType, options);
    if (type === 'text') return optimizeText(buf, mimeType, method);
    if (type === 'esbuild') return optimizeEsbuild(buf, ext, method);
    if (type === 'wasm') return optimizeWasm(buf, method);
    if (type === 'archive') return optimizeZip(buf, options);
    throw new Error(`Unknown direct task type: ${type}`);
  }

  destroy() {
    this.isDestroyed = true;
    for (const w of this.workers) {
      w.terminate();
    }
    this.workers = [];
    this.freeWorkers = [];
  }
}

// Global Singleton Pool
let globalPool = null;

function getWorkerPool() {
  if (!globalPool) {
    globalPool = new WorkerPool();
  }
  return globalPool;
}

module.exports = {
  WorkerPool,
  getWorkerPool,
};
