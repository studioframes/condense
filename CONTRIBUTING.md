# Contributing to Condense

Thank you for contributing to Condense! Please review this document before submitting issues or pull requests.

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/condense-api.git
   cd condense-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Test your standalone CLI locally:
   ```bash
   npm start
   ```

## Development Guidelines

Because Condense is distributed as an npm package, you must maintain compatibility across all three distribution paths:

1. **No Local Disk Access:** Do not write temporary files to the disk (`/tmp`, `multer.diskStorage`, etc.). Use pure in-memory Buffers and Node Streams to maintain statelessness.
2. **Keep Core Helpers Modular:** Ensure helper files inside `src/services/` are decoupled from Express HTTP objects (`req`, `res`) so they can still be safely imported programmatically.
3. **Respect Bypass Directives:** If adding new language processors, ensure they respect bypass parameters or check for `data-condense-ignore` patterns.

## Submission Workflow
1. Fork the repo and create your branch from `main`.
2. Commit your changes and ensure they don't break existing package exports.
3. Submit a Pull Request targeting `main`.