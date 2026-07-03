# Troubleshooting Guide

This page covers common issues you may hit while using or extending Condense.

## Unsupported file type

If the API returns an error saying the file type is unsupported, verify that the MIME type or file extension is one of the formats implemented by Condense.

Common checks:

- Confirm the uploaded file extension is correct
- Try a known supported format such as PNG, JPEG, HTML, JS, or MP4
- If the file is a less common format, consider converting it before optimization

## Slow processing or timeouts

Large media assets or very large bundles can take longer to process. The HTTP app has a default timeout to protect the server from hanging requests.

Recommended actions:

- Keep media files reasonably sized for interactive use
- Use the CLI for batch jobs instead of the HTTP endpoint when appropriate
- Optimize in smaller batches if you are processing many files

## Cache behavior

The cache is optional and only applies to non-streaming formats. If you do not see a cache hit, confirm that:

- CONDENSE_CACHE=true is set in the environment
- The request uses a supported content type
- The input content and optimization settings are the same as a previous request

## CLI output issues

If the CLI does not produce output as expected:

- Verify the input path exists
- Make sure the output directory is writable
- Confirm the selected method is one of quality, balanced, or extreme

## Debugging tips

- Reproduce the problem with a small known-good file first
- Compare behavior across the CLI, SDK, and HTTP API to narrow down the layer that is failing
- Check the logs and error messages returned by the server for context
