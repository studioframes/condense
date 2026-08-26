# Enterprise Telemetry & ROI Tracking Guide

Optimizing assets reduces page load latency, cuts egress bandwidth costs, and lowers the carbon footprint of digital infrastructure.

Condense v1.0.0 includes an in-memory **Enterprise Telemetry & ROI Service** (`telemetryService`) that tracks asset savings in real time and calculates quantifiable financial and environmental impacts.

---

## 1. Metrics Tracked

The `telemetryService` aggregates:
- **`totalFiles`**: Total number of assets processed.
- **`totalOriginalBytes`**: Combined input file size.
- **`totalOptimizedBytes`**: Combined output file size.
- **`totalSavedBytes`**: Total bytes prevented from being served over networks.
- **`averageReductionRatio`**: Percentage size reduction achieved.
- **`byMimeType`**: Granular breakdown of files processed and bytes saved per MIME category.
- **`estimatedCostSavingsUsd`**: Estimated dollar savings based on industry cloud egress rates ($0.08 per GB).
- **`estimatedCarbonReductionGrams`**: Estimated reduction in grams of $\text{CO}_2$ ($\sim 0.0000003\,\text{gCO}_2/\text{byte}$).

---

## 2. Programmatic Usage

### Recording Events

The internal controller and services automatically record operations, but you can also record custom pipeline events directly:

```javascript
const { telemetryService } = require('@studioframes/condense');

// Record an optimization event: (mimeType, originalBytes, optimizedBytes)
telemetryService.record('image/jpeg', 2048000, 512000);
```

### Querying Real-Time Metrics

```javascript
const { telemetryService } = require('@studioframes/condense');

const metrics = telemetryService.getMetrics();

console.log('--- Condense Optimization Report ---');
console.log(`Files Processed: ${metrics.totalFiles}`);
console.log(`Bandwidth Saved: ${metrics.totalSavedBytesFormatted}`);
console.log(`Average Reduction: ${(metrics.averageReductionRatio * 100).toFixed(1)}%`);
console.log(`Est. Egress Cost Savings: $${metrics.estimatedCostSavingsUsd}`);
console.log(`Est. Carbon Avoidance: ${metrics.estimatedCarbonReductionGrams} gCO2`);
```

### Querying Format-Specific Breakdown

```javascript
const metrics = telemetryService.getMetrics();

for (const [mime, data] of Object.entries(metrics.byMimeType)) {
  console.log(`${mime}: ${data.files} files, ${(data.savedBytes / 1024).toFixed(1)} KB saved`);
}
```

### Resetting Metrics

For isolated test suites or periodic metric flushing:

```javascript
telemetryService.reset();
```

---

## 3. Integrating with Dashboards & APMs

Because `telemetryService.getMetrics()` returns a pure JavaScript object, it integrates into Datadog, Prometheus, Grafana, CloudWatch, or custom administrative dashboards:

```javascript
app.get('/metrics', (req, res) => {
  res.json(telemetryService.getMetrics());
});
```
