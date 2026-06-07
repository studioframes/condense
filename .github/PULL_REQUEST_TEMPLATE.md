## Description
<!-- Provide a summary of the change, problem solved, or the target issue being addressed. -->
Fixes # (issue)

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Code Refactor / Performance Improvement

## Integration Verification
Because this is published as an npm package, please confirm you have verified your changes against the following:
- [ ] Tested via Standalone CLI (`npx condense-api` or `npm start`)
- [ ] Tested as an Express middleware import (`condenseApp`)
- [ ] Tested programmatically (`optimizeImage`, `optimizeText`, or `optimizeMediaStream`)

## Architecture Checklist
- [ ] My changes write zero files to local storage (strictly RAM-only).
- [ ] No Express dependencies are required inside the `src/services` logic.
- [ ] If dealing with HTML/CSS/JS, the `data-condense-ignore` / `/* condense-ignore */` rules are correctly preserved.