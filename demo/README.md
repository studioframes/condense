# Condense Benchmark and Demonstration Suite

This directory contains the standardized benchmarking suite used to demonstrate and validate the multi-format optimization capabilities of the Condense engine. It tests files across primary supported MIME categories (Images, Web Frameworks, Configs, Vectors, Style Preprocessors, Video Streams, and Binary formats) across all three pipeline optimization modes: `quality`, `balanced`, and `extreme`.

## Directory Structure

```text
demo/
├── original/   # Unoptimized source assets containing formatting bloat and metadata.
├── quality/    # Maximum fidelity optimization preserving structural composition.
├── balanced/   # Balanced footprint compression prioritizing runtime safety and weight reduction.
└── condensed/  # Maximum compression (extreme mode) targeting absolute minimum storage payloads.

```

## Performance Metrics Comparison

The following table reflects the exact metrics captured during processing passes for version 0.3.0.

| File Name | Original Size | Quality Size | Balanced Size | Extreme Size | Max Reduction |
| --- | --- | --- | --- | --- | --- |
| `styles.scss` | 1.3 KB | 0.3 KB | 0.3 KB | 0.3 KB | -76.2% |
| `demo.png` | 115.3 KB | 98.9 KB | 98.9 KB | 26.7 KB | -76.8% |
| `app.js` | 5.0 KB | 1.8 KB | 1.8 KB | 1.4 KB | -72.5% |
| `component.tsx` | 2.6 KB | 1.8 KB | 1.8 KB | 1.0 KB | -61.0% |
| `service.ts` | 2.2 KB | 1.5 KB | 1.5 KB | 0.9 KB | -58.0% |
| `view.jsx` | 2.3 KB | 1.8 KB | 1.8 KB | 1.1 KB | -52.2% |
| `demo.svg` | 217.0 KB | 119.5 KB | 119.5 KB | 119.3 KB | -45.0% |
| `styles.css` | 1.0 KB | 0.7 KB | 0.7 KB | 0.6 KB | -36.4% |
| `index.html` | 2.4 KB | 1.6 KB | 1.6 KB | 1.5 KB | -35.9% |
| `config.yml` | 0.9 KB | 0.7 KB | 0.7 KB | 0.6 KB | -30.0% |
| `data.json` | 0.5 KB | 0.4 KB | 0.4 KB | 0.4 KB | -25.7% |
| `demo.mp4` | 30.8 KB | 31.6 KB | 29.4 KB | 25.8 KB | -16.4% |

## Core Pipeline Insights

### Compression Strategies Breakdown

* **Quality & Balanced Profiles:** For several asset configurations (such as abstract layout structures in JSON or structured nested tokens inside SCSS/CSS frameworks), the `quality` and `balanced` execution graphs map identically, maintaining highly readable, fail-safe code structures while claiming up to 74.1% in data savings.
* **Extreme Profile Execution:** The `extreme` method unlocks deep compiler optimizations. It shifts standard formatting algorithms into aggressive byte-pinching operations, executing variable identifier mangling across components and changing lossy binary allocations to reduce binary payloads like PNGs by 76.8%.

## Batch Processing Exceptions

### Out-of-Band Media Pipelines

* **`demo.mp4`:** High-volume streaming media assets are bypassed during normal batch CLI sweeps to prevent memory saturation. Processing through the standalone, out-of-band `curl` HTTP pipeline allows the core engine to safely perform frame-interlace optimization and inter-frame stream flattening.