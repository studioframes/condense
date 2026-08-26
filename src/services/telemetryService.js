'use strict';

/**
 * In-memory Telemetry & ROI Tracking Service for Condense.
 * Tracks bytes processed, saved, ratios, throughput, cost savings, and carbon emissions.
 */
class TelemetryService {
  constructor() {
    this.reset();
  }

  reset() {
    this.startTime = Date.now();
    this.totalRequests = 0;
    this.totalFiles = 0;
    this.totalBytesIn = 0;
    this.totalBytesOut = 0;
    this.totalDurationMs = 0;
    this.categories = {
      image: { in: 0, out: 0, count: 0, durationMs: 0 },
      media: { in: 0, out: 0, count: 0, durationMs: 0 },
      text: { in: 0, out: 0, count: 0, durationMs: 0 },
      esbuild: { in: 0, out: 0, count: 0, durationMs: 0 },
      wasm: { in: 0, out: 0, count: 0, durationMs: 0 },
      archive: { in: 0, out: 0, count: 0, durationMs: 0 },
      font: { in: 0, out: 0, count: 0, durationMs: 0 },
      pdf: { in: 0, out: 0, count: 0, durationMs: 0 },
    };
    this.recentEvents = [];
  }

  /**
   * Records an optimization event.
   *
   * @param {string} category - 'image' | 'media' | 'text' | 'esbuild' | 'wasm' | 'archive' | 'font' | 'pdf'
   * @param {number} bytesIn - Original input size in bytes
   * @param {number} bytesOut - Output size in bytes
   * @param {number} durationMs - Processing duration in milliseconds
   * @param {Object} metadata - Optional metadata
   */
  record(category, bytesIn, bytesOut, durationMs = 0, metadata = {}) {
    this.totalRequests++;
    this.totalFiles++;
    this.totalBytesIn += bytesIn;
    this.totalBytesOut += bytesOut;
    this.totalDurationMs += durationMs;

    const catKey = this.categories[category] ? category : 'text';
    this.categories[catKey].in += bytesIn;
    this.categories[catKey].out += bytesOut;
    this.categories[catKey].count += 1;
    this.categories[catKey].durationMs += durationMs;

    // Keep the last 50 recent events for diagnostics
    this.recentEvents.push({
      timestamp: Date.now(),
      category: catKey,
      bytesIn,
      bytesOut,
      savedBytes: Math.max(0, bytesIn - bytesOut),
      durationMs,
      ...metadata,
    });

    if (this.recentEvents.length > 50) {
      this.recentEvents.shift();
    }
  }

  /**
   * Returns calculated metrics and ROI statistics.
   */
  getMetrics() {
    const bytesSaved = Math.max(0, this.totalBytesIn - this.totalBytesOut);
    const overallRatio = this.totalBytesIn > 0 ? ((bytesSaved / this.totalBytesIn) * 100).toFixed(1) : '0.0';

    // Economic ROI: Average CDN egress cost ~$0.08 per GB ($0.00000008 per KB)
    const gigabytesSaved = bytesSaved / (1024 * 1024 * 1024);
    const estimatedCostSavingsUsd = Number((gigabytesSaved * 0.08).toFixed(4));

    // Environmental ROI: Global average web data center emissions ~0.2g CO2 per MB transferred
    const megabytesSaved = bytesSaved / (1024 * 1024);
    const estimatedCo2SavedGrams = Number((megabytesSaved * 0.2).toFixed(2));

    // Performance throughput: MB/s
    const totalDurationSec = this.totalDurationMs / 1000;
    const throughputMBs = totalDurationSec > 0
      ? Number(((this.totalBytesIn / (1024 * 1024)) / totalDurationSec).toFixed(2))
      : 0;

    const categoryBreakdown = {};
    for (const [key, val] of Object.entries(this.categories)) {
      const saved = Math.max(0, val.in - val.out);
      const ratio = val.in > 0 ? ((saved / val.in) * 100).toFixed(1) : '0.0';
      categoryBreakdown[key] = {
        filesProcessed: val.count,
        bytesIn: val.in,
        bytesOut: val.out,
        bytesSaved: saved,
        reductionPercent: Number(ratio),
        avgDurationMs: val.count > 0 ? Number((val.durationMs / val.count).toFixed(1)) : 0,
      };
    }

    return {
      uptimeSeconds: Math.round((Date.now() - this.startTime) / 1000),
      totalRequests: this.totalRequests,
      totalFiles: this.totalFiles,
      totalBytesIn: this.totalBytesIn,
      totalBytesOut: this.totalBytesOut,
      totalBytesSaved: bytesSaved,
      overallReductionPercent: Number(overallRatio),
      throughputMBps: throughputMBs,
      roi: {
        estimatedBandwidthSavedGB: Number(gigabytesSaved.toFixed(3)),
        estimatedCostSavingsUSD: estimatedCostSavingsUsd,
        estimatedCo2SavedGrams: estimatedCo2SavedGrams,
      },
      categories: categoryBreakdown,
      recentEvents: this.recentEvents.slice(-10),
    };
  }
}

// Global Singleton
const telemetry = new TelemetryService();

module.exports = telemetry;
