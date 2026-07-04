<div align="center">

![logo](https://github.com/user-attachments/assets/b7277c45-e2f2-4345-852b-47403b157f5d)

[![npm](https://conbadges.pages.dev/api/npm/v/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![downloads](https://conbadges.pages.dev/api/npm/dt/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![License](https://conbadges.pages.dev/api/badge?label=license&value=Apache-2.0)](./LICENSE)

**Condense es un motor de minificación y optimización de archivos sin estado y de alto rendimiento para [Node.js](https://nodejs.org). Optimiza imágenes, audio, video, código y WebAssembly completamente en memoria utilizando Buffers y Streams, evitando la escritura de archivos temporales en el disco.**

[English](README.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md)

</div>

## Introducción

Condense proporciona una optimización rápida y en memoria para medios, código y binarios. Su objetivo es ofrecer un procesamiento sin estado y de baja latencia para entornos de servidor y serverless donde la E/S (I/O) de disco temporal no es deseada o no está disponible. A diferencia de las herramientas tradicionales que dependen de archivos temporales intermedios, Condense procesa las cargas y los activos utilizando Buffers y Streams, devolviendo Buffers o Streams optimizados listos para enviar en las respuestas.

### Tabla de Contenidos
- <a href="#why-condense">¿Por qué Condense?</a>
- <a href="#features">Características</a>
- <a href="#supported-formats">Formatos Soportados</a>
- <a href="#installation">Instalación</a>
- <a href="#quick-start">Inicio Rápido</a>
- <a href="#usage">Uso</a>
- <a href="#ignore-directives">Directivas de Ignorado</a>
- <a href="#api-reference-selected">Referencia de la API</a>
- <a href="#benchmarks">Benchmarks</a>
- <a href="#system-requirements">Requisitos del Sistema</a>
- <a href="#code-of-conduct">Código de Conducta</a>
- <a href="#contributing-to-condense">Contribución</a>
- <a href="#license">Licencia</a>

## ¿Por qué Condense?

- **Sin archivos temporales:** Procesa archivos completamente en memoria utilizando Buffers y Streams sin escribir archivos temporales en el disco.
- **Arquitectura sin estado:** Las optimizaciones se realizan por solicitud sin un estado persistente, lo que facilita el escalado horizontal.
- **Amigable con las APIs:** Diseñado para integrarse de forma limpia en APIs HTTP y microservicios.
- **Listo para Serverless:** Funciona de manera excelente en entornos efímeros (Cloud Functions, entornos de ejecución tipo Lambda) donde el acceso al disco es limitado.
- **Alto rendimiento:** Flujos de trabajo eficientes adecuados para el procesamiento de medios de gran volumen.
- **Baja latencia:** Optimizado para una latencia mínima añadida en los flujos de solicitud/respuesta.

## Características
- Procesamiento en memoria con Buffers y Streams (sin escrituras temporales en disco, excepto al invocar explícitamente `faststart`)
- Optimización de imágenes (incluyendo AVIF y GIF), audio, video, código/marcado (incluyendo SVG) y WebAssembly
- Redimensión dinámica inteligente a través de los parámetros de la API `width`, `height` y `fit`
- Extracción de miniaturas de video y utilidades estándar MP4 Faststart
- Middleware para Express y CLI independiente con una hermosa interfaz de terminal
- Directivas de ignorado para excluir regiones o archivos específicos de la minificación
- Caché LRU integrada para activos estáticos optimizados frecuentemente (habilitada mediante `CONDENSE_CACHE=true`)
- API de diagnóstico de salud del sistema (`/health`)

## Formatos Soportados

| Categoría | Formatos |
| --- | --- |
| Imágenes | `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`, `.svg` |
| Audio | `.mp3`, `.wav` |
| Video | `.mp4` |
| Web | `.html`, `.css`, `.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `.xml`, `.yaml`, `.yml`, `.graphql`, `.less`, `.scss` |

## Instalación

Instala con tu gestor de paquetes preferido:

#### npm

```bash
npm i @studioframes/condense

```

#### yarn

```bash
yarn add @studioframes/condense

```

#### pnpm

```bash
pnpm add @studioframes/condense

```

#### bun

```bash
bun add @studioframes/condense

```

## Inicio Rápido

El ejemplo más simple dentro del proceso — optimiza un Buffer de imagen y obtén un Buffer optimizado de vuelta:

```javascript
const { optimizeImage } = require('@studioframes/condense');

async function simpleOptimize(rawBuffer) {
  const { buffer: optimized, outMime } = await optimizeImage(rawBuffer, 'image/png', 'quality');
  // envía `optimized` como el cuerpo de la respuesta HTTP con el Content-Type `outMime`
  return { optimized, outMime };
}

// Uso: pasa un Buffer (por ejemplo, desde una carga de archivo o respuesta fetch)

```

## Uso

Condense puede ejecutarse como una herramienta CLI independiente, un servidor, montarse como middleware de Express o utilizarse de forma programática.

## Documentación

El conjunto de documentación se ha expandido y ahora está organizado tanto para nuevos usuarios como para colaboradores. Comienza con el centro de documentación en [docs/README.md](https://www.google.com/search?q=./docs/README.md), luego explora las guías más profundas a continuación:

* [docs/overview.md](https://www.google.com/search?q=./docs/overview.md) para una descripción general del proyecto y sus objetivos
* [docs/api.md](https://www.google.com/search?q=./docs/api.md) para opciones de integración a través del SDK, API HTTP y CLI
* [docs/architecture.md](https://www.google.com/search?q=./docs/architecture.md) para una mirada de alto nivel a la arquitectura del servicio
* [docs/cli.md](https://www.google.com/search?q=./docs/cli.md) para ejemplos de uso de la CLI y flujos de trabajo por lotes
* [docs/examples.md](https://www.google.com/search?q=./docs/examples.md) para fragmentos prácticos del SDK y la CLI
* [docs/development.md](https://www.google.com/search?q=./docs/development.md) para la configuración local y guía de contribución
* [docs/configuration.md](https://www.google.com/search?q=./docs/configuration.md) para opciones de solicitud y configuración basada en el entorno
* [docs/troubleshooting.md](https://www.google.com/search?q=./docs/troubleshooting.md) para problemas comunes y consejos de depuración
* [docs/deployment.md](https://www.google.com/search?q=./docs/deployment.md) para la guía de despliegue en producción
* [docs/faq.md](https://www.google.com/search?q=./docs/faq.md) para preguntas y respuestas comunes
* [MIGRATION_GUIDE.md](https://www.google.com/search?q=./MIGRATION_GUIDE.md) para notas de actualización de versión a versión
* [ECOSYSTEM/DEPENDENCIES.md](https://www.google.com/search?q=./ECOSYSTEM/DEPENDENCIES.md) para el inventario de dependencias y el propósito de cada paquete
* **Optimización CLI:** `npx @studioframes/condense optimize ./src -o ./dist -m balanced` (Ver [COMMANDS.md](https://www.google.com/search?q=./COMMANDS.md) para la documentación completa de la CLI)
* **Servidor:** `npx @studioframes/condense` (por defecto en el puerto 3000; establece `PORT` para sobrescribirlo)
* **Express:** monta `condenseApp` en una ruta para aceptar cargas de archivos
* **Programático:** utiliza ayudantes como `optimizeImage`, `optimizeText`, `optimizeMediaStream`, `optimizeEsbuild`, `optimizeWasm`

### Ejemplos

#### Uso de la CLI

Condense v0.3.0 introdujo una CLI estilizada y completa:

```bash
# Optimiza una sola imagen con compresión extrema
npx @studioframes/condense optimize photo.png -o out.webp --method extreme

# Optimiza en lote un directorio utilizando el método balanceado
npx @studioframes/condense optimize ./src/ -o ./dist/ --method balanced

```

#### Middleware de Express

```javascript
const express = require('express');
const { condenseApp } = require('@studioframes/condense');

const app = express();

// Monta todas las rutas de optimización bajo una ruta específica
app.use('/v1', condenseApp);

app.listen(8080, () => {
    console.log('Aplicación en ejecución. Envía archivos por POST a http://localhost:8080/v1/optimize');
});

```

#### SDK de Ayuda Programática

```javascript
const { optimizeImage, optimizeText, optimizeMediaStream, optimizeEsbuild } = require('@studioframes/condense');

// 1. Optimizar un Buffer de Imagen (devuelve un Buffer)
const { buffer: imgBuffer, outMime: imgMime } = await optimizeImage(rawImageBuffer, 'image/png', 'extreme');

// 2. Optimizar un Buffer HTML / CSS / JS (devuelve un Buffer)
const { buffer: textBuffer, outMime: textMime } = await optimizeText(rawHtmlBuffer, 'text/html', 'balanced');

// 3. Optimizar Audio / Video (devuelve un Stream PassThrough)
const { stream, outMime: mediaMime } = optimizeMediaStream(rawVideoBuffer, 'video/mp4', 'quality');

// 4. Optimizar TypeScript/React (devuelve un Buffer)
const { buffer: tsBuffer, outMime: tsMime } = await optimizeEsbuild(rawTsBuffer, '.tsx', 'quality');

```

## Métodos de Optimización

Condense proporciona tres objetivos principales de optimización:

* `quality` (Por defecto): Compresión segura y visualmente sin pérdidas, preserva la máxima fidelidad.
* `balanced`: El punto ideal entre el tamaño del archivo y la calidad. Introduce una compresión con pérdidas moderada (por ejemplo, 65% de calidad para JPEGs, crf 26 para video).
* `extreme`: Compresión máxima. Fuerza las conversiones a formatos modernos (por ejemplo, JPEG/PNG a WebP/AVIF), elimina los console logs, descarta las secciones personalizadas de WASM y reduce la resolución del video.

## Directivas de Ignorado

Utiliza directivas de ignorado para evitar la minificación de un archivo o una región específica.

* `html`: añade `data-condense-ignore` a cualquier elemento (o a `<html>` para ignorar todo el documento).
* Código (`js`, `css`, `ts`, `jsx`, `tsx`, `less`, `scss`): añade el comentario `/* condense-ignore */` en cualquier lugar del archivo para omitir la minificación.

### Ejemplos

#### `html`

```html
<div data-condense-ignore>
  <pre>
    Espaciado y contenido preservados aquí
  </pre>
</div>

```

#### `js`/`ts`

```javascript
/* condense-ignore */
function legacyCode() {
    // Este archivo no será alterado
    var x =   10; 
}

```

## Referencia de la API (seleccionada)

POST `/optimize`

* Formulario Multipart: `file` (binario), `method` (`quality` | `balanced` | `extreme`)
* Parámetros opcionales de formulario/consulta: `width`, `height`, `fit`, `keepMetadata`, `keepFormat`, `targetFormat`, `faststart`, `thumbnail`.
* Devuelve el binario optimizado en el cuerpo de la respuesta con el `Content-Type` adecuado.

### Ejemplo de Solicitud:

```bash
curl -X POST http://localhost:3000/optimize \
  -F "file=@./photo.png;type=image/png" \
  -F "method=balanced" \
  --output photo-condensed.png

```

Explicación breve: las cargas se reciben en memoria (Buffers o Streams), son procesadas por Condense en memoria, opcionalmente se guardan en la caché LRU y se devuelven como un Buffer o Stream optimizado sin escrituras intermedias en el disco.

## Benchmarks

A continuación se muestran los resultados de los benchmarks al procesar nuestra suite de muestras a través del flujo de `Condense` utilizando los métodos `quality`, `balanced` y `extreme`. Consulta el directorio [`demo`](https://github.com/studioframes/Condense/tree/main/demo) para saber más.

| Nombre del Archivo | Tamaño Original | Tamaño Quality | Tamaño Balanced | Tamaño Extreme | Reducción Máx |
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

## Requisitos del Sistema

* Node.js mínimo: >= 20.9

## Código de Conducta

Esperamos que los participantes del proyecto se adhieran al código de conducta de los repositorios. Por favor, lee [el texto completo](https://github.com/studioframes/Condense/blob/main/CODE_OF_CONDUCT.md) para que puedas entender qué acciones serán o no toleradas.

## Contribución a Condense

Damos la bienvenida a las contribuciones de todos. Lee nuestra [guía de contribución](https://github.com/studioframes/Condense/blob/main/CONTRIBUTING.md) para conocer nuestro proceso de desarrollo, cómo proponer soluciones a errores y mejoras, y cómo construir y probar tus cambios en Condense.

## Licencia

Este proyecto está gestionado por Studio Frames y está bajo la Licencia Apache 2.0. Consulta [LICENSE](https://github.com/studioframes/Condense/blob/main/LICENSE) para ver el texto completo.