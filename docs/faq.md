# FAQ

## Is Condense safe for production use?

Condense is designed to be stateless and in-memory, which makes it a good fit for APIs, web services, and serverless environments. It is best used for optimizing assets and uploads rather than as a general-purpose file storage system.

## Does Condense write temporary files by default?

No. The default design is to process content in memory using buffers and streams. Temporary disk usage is avoided unless a specific workflow requires it.

## Which optimization modes should I use?

- quality for the best fidelity
- balanced for a practical balance of size and quality
- extreme for maximum compression and aggressive transformations
