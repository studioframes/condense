# Frequently Asked Questions (FAQ)

## Is Condense safe for high-throughput production workloads?

Yes. Condense is designed from the ground up to be stateless and operate completely in memory using Buffers and Streams. It avoids temporary disk writes by default, eliminating I/O bottlenecks and race conditions in concurrent or serverless environments.

## Does Condense support parallel multi-core processing?

Yes. Condense v1.0.0 includes a built-in `WorkerPool` that leverages Node.js `worker_threads` to distribute CPU-intensive operations (image encoding, perceptual SSIM calculations, ZIP processing) across multiple worker threads.

## What is Perceptual SSIM Optimization?

Perceptual optimization uses the Structural Similarity Index (SSIM) and Peak Signal-to-Noise Ratio (PSNR) to measure perceived visual degradation. Rather than picking an arbitrary compression quality number, Condense performs a binary search to find the absolute minimum file size that satisfies your exact visual quality requirement (e.g. SSIM $\ge 0.95$).

## Does Condense write temporary files by default?

No. The default design is strictly in-memory processing. Temporary disk writes are avoided unless explicitly required by specific operations (such as MP4 faststart).

## Which optimization mode should I choose?

- **`quality`**: Best fidelity with visually lossless, conservative compression. Ideal for photography or brand assets.
- **`balanced`**: A practical balance of file size and speed. Recommended default for standard web delivery.
- **`extreme`**: Maximum compression for bandwidth-critical contexts, converting assets to modern formats and stripping non-critical metadata.

