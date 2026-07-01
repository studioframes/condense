# Examples

## Image optimization example

```javascript
const { optimizeImage } = require('@studioframes/condense');

const { buffer, outMime } = await optimizeImage(bufferFromUpload, 'image/png', 'balanced');
```

## Text optimization example

```javascript
const { optimizeText } = require('@studioframes/condense');

const { buffer, outMime } = await optimizeText(htmlBuffer, 'text/html', 'quality');
```

## CLI example

```bash
npx @studioframes/condense optimize ./demo -o ./dist --method extreme
```
