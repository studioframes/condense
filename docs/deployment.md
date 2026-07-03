# Deployment Guide

Condense can be deployed in several ways, depending on whether you want a lightweight API, a local automation tool, or a middleware layer inside a larger application.

## Server deployment

For a standard Node.js server deployment:

1. Install Condense in your project
2. Start the HTTP app or mount the Express app into your existing server
3. Configure request timeouts and file size limits to match your workload
4. Monitor memory usage and processing latency under load

## Serverless and container environments

Condense is a good fit for serverless and container-based workloads because it is designed to work in memory and avoids temporary file writes by default.

Good practices include:

- Keep request payloads modest for interactive traffic
- Use environment-based configuration for cache and runtime options
- Consider a queue or worker model for large batch jobs

## Recommended production settings

- Enable caching only when it is beneficial for your workload
- Use the balanced mode by default unless your use case requires more aggressive compression
- Validate that your deployment environment has the required runtime support for media and image processing

## Operational checklist

- Confirm the process can access the required system libraries for media workflows
- Set reasonable request timeouts to avoid stalled uploads
- Monitor health endpoints and memory metrics
- Re-test major upgrades using the migration guide before rolling them out broadly
