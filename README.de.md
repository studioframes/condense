<div align="center">

[![logo](https://github.com/user-attachments/assets/7c1cebfa-f186-4dab-9dc1-fee7474a30dc)](https://condense.js.org)

[![npm](https://conbadges.pages.dev/api/npm/v/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![downloads](https://conbadges.pages.dev/api/npm/dt/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![License](https://conbadges.pages.dev/api/badge?label=license&value=Apache-2.0)](./LICENSE)

**[Condense](https://condense.js.org) ist eine leistungsstarke, zustandslose Engine zur Dateioptimierung und -minimierung für [Node.js](https://nodejs.org). Sie optimiert Bilder, Audio, Video, Code und WebAssembly vollständig im Arbeitsspeicher mithilfe von Buffern und Streams und vermeidet das Schreiben temporärer Dateien auf die Festplatte.**

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [Português (Brasil)](README.pt-BR.md) • [Deutsch](README.de.md) • [Français](README.fr.md)

</div>

## Einführung

Condense bietet eine schnelle In-Memory-Optimierung für Medien, Code und Binärdateien. Sie wurde entwickelt, um eine zustandslose Verarbeitung mit geringer Latenz für Server- und Serverless-Umgebungen bereitzustellen, in denen temporäre Festplatten-E/A unerwünscht oder nicht verfügbar ist. Im Gegensatz zu herkömmlichen Tools, die auf temporäre Zwischendateien angewiesen sind, verarbeitet Condense Uploads und Assets mithilfe von Buffern und Streams und gibt optimierte Buffer oder Streams zurück, die direkt in Antworten gesendet werden können.

### Inhaltsverzeichnis
- <a href="#why-condense">Warum Condense?</a>
- <a href="#features">Features</a>
- <a href="#supported-formats">Unterstützte Formate</a>
- <a href="#installation">Installation</a>
- <a href="#quick-start">Schnellstart</a>
- <a href="#usage">Verwendung</a>
- <a href="#ignore-directives">Ignorier-Anweisungen</a>
- <a href="#api-reference-selected">API-Referenz</a>
- <a href="#benchmarks">Benchmarks</a>
- <a href="#system-requirements">Systemanforderungen</a>
- <a href="#code-of-conduct">Verhaltenskodex</a>
- <a href="#contributing-to-condense">Beitragen</a>
- <a href="#license">Lizenz</a>

## Warum Condense?

- **Keine temporären Dateien:** Verarbeitet Dateien vollständig im Arbeitsspeicher mithilfe von Buffern und Streams, ohne temporäre Dateien auf die Festplatte zu schreiben.
- **Zustandslose Architektur:** Optimierungen werden pro Anfrage ohne persistenten Zustand durchgeführt, was die horizontale Skalierung erleichtert.
- **API-freundlich:** Entwickelt für eine saubere Integration in HTTP-APIs und Mikroservices.
- **Serverless-ready:** Funktioniert hervorragend in flüchtigen Umgebungen (Cloud Functions, Lambda-ähnliche Laufzeiten), in denen der Festplattenzugriff eingeschränkt ist.
- **Hoher Durchsatz:** Effiziente Pipelines, die für die Verarbeitung großer Medienmengen geeignet sind.
- **Geringe Latenz:** Optimiert für minimale zusätzliche Latenz in Anfrage-/Antwortzyklen.

## Features
- In-Memory-Buffer- und Stream-Verarbeitung (keine temporären Festplattenschreibvorgänge, außer bei explizitem Aufruf von `faststart`)
- Optimierung von Bildern (einschließlich AVIF & GIF), Audio, Video, Code/Markup (einschließlich SVG) und WebAssembly
- Intelligente dynamische Größenanpassung über die API-Parameter `width`, `height` und `fit`
- Extraktion von Video-Thumbnails und Standard-MP4-Faststart-Dienstprogramme
- Express-Middleware und eigenständige CLI mit einer ansprechenden Terminal-UI
- Ignorier-Anweisungen, um bestimmte Regionen oder Dateien von der Minimierung auszuschließen
- Integrierter LRU-Cache für häufig optimierte statische Assets (aktiviert über `CONDENSE_CACHE=true`)
- Systemintegritäts-Diagnose-API (`/health`)

## Unterstützte Formate

| Kategorie | Formate |
| --- | --- |
| Bilder | `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`, `.svg` |
| Audio | `.mp3`, `.wav` |
| Video | `.mp4` |
| Web | `.html`, `.css`, `.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `.xml`, `.yaml`, `.yml`, `.graphql`, `.less`, `.scss` |

## Installation

Installieren Sie es mit dem Paketmanager Ihrer Wahl:

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

## Schnellstart

Das einfachste In-Process-Beispiel – optimieren Sie einen Bild-Buffer und erhalten Sie einen optimierten Buffer zurück:

```javascript
const { optimizeImage } = require('@studioframes/condense');

async function simpleOptimize(rawBuffer) {
  const { buffer: optimized, outMime } = await optimizeImage(rawBuffer, 'image/png', 'quality');
  // Senden Sie `optimized` als HTTP-Antwortstruktur mit dem Content-Type `outMime`
  return { optimized, outMime };
}

// Verwendung: Übergeben Sie einen Buffer (z. B. aus einem Datei-Upload oder einer Fetch-Antwort)

```

## Verwendung

Condense kann als eigenständiges CLI-Tool, als Server ausgeführt, als Express-Middleware eingebunden oder programmatisch verwendet werden.

## Dokumentation

Die Dokumentation wurde erweitert und ist nun sowohl für neue Benutzer als auch für Mitwirkende strukturiert. Beginnen Sie im Dokumentationszentrum unter [docs/README.md](./docs/README.md) und lesen Sie die tiefergehenden Leitfäden unten:

* [docs/overview.md](./docs/overview.md) für einen Überblick über das Projekt und seine Ziele
* [docs/api.md](./docs/api.md) für Integrationsoptionen über das SDK, die HTTP-API und die CLI
* [docs/architecture.md](./docs/architecture.md) für einen allgemeinen Blick auf die Architektur des Dienstes
* [docs/cli.md](./docs/cli.md) für CLI-Nutzungsbeispiele und Batch-Workflows
* [docs/examples.md](./docs/examples.md) für praktische SDK- und CLI-Snippets
* [docs/development.md](./docs/development.md) für die lokale Einrichtung und Richtlinien für Beiträge
* [docs/configuration.md](./docs/configuration.md) für Anfrageoptionen und umgebungsbasierte Konfiguration
* [docs/troubleshooting.md](./docs/troubleshooting.md) für häufige Probleme und Debugging-Tipps
* [docs/deployment.md](./docs/deployment.md) für Produktions-Deployment-Leitfäden
* [docs/faq.md](./docs/faq.md) für häufig gestellte Fragen und Antworten
* [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) für Hinweise zu Upgrades von Version zu Version
* [ECOSYSTEM/DEPENDENCIES.md](./ECOSYSTEM/DEPENDENCIES.md) für das Abhängigkeitsinventar und den Zweck jedes Pakets
* **CLI-Optimierung:** `npx @studioframes/condense optimize ./src -o ./dist -m balanced` (Siehe [COMMANDS.md](./COMMANDS.md) für die vollständige CLI-Dokumentation)
* **Server:** `npx @studioframes/condense` (Standardport ist 3000; setzen Sie `PORT`, um diesen zu überschreiben)
* **Express:** Binden Sie `condenseApp` auf einer Route ein, um Uploads zu akzeptieren
* **Programmatisch:** Verwenden Sie Hilfsfunktionen wie `optimizeImage`, `optimizeText`, `optimizeMediaStream`, `optimizeEsbuild`, `optimizeWasm`

### Beispiele

#### CLI-Verwendung

Condense v0.3.0 hat eine gestaltete, voll funktionsfähige CLI eingeführt:

```bash
# Optimieren Sie ein einzelnes Bild mit extremer Komprimierung
npx @studioframes/condense optimize photo.png -o out.webp --method extreme

# Verzeichnisse stapelweise mit der Methode "balanced" optimieren
npx @studioframes/condense optimize ./src/ -o ./dist/ --method balanced

```

#### Express-Middleware

```javascript
const express = require('express');
const { condenseApp } = require('@studioframes/condense');

const app = express();

// Alle Optimierungsrouten unter einem bestimmten Pfad einbinden
app.use('/v1', condenseApp);

app.listen(8080, () => {
    console.log('App läuft. Senden Sie POST-Dateien an http://localhost:8080/v1/optimize');
});

```

#### Programmatisches Helfer-SDK

```javascript
const { optimizeImage, optimizeText, optimizeMediaStream, optimizeEsbuild } = require('@studioframes/condense');

// 1. Einen Bild-Buffer optimieren (gibt Buffer zurück)
const { buffer: imgBuffer, outMime: imgMime } = await optimizeImage(rawImageBuffer, 'image/png', 'extreme');

// 2. Einen HTML- / CSS- / JS-Buffer optimieren (gibt Buffer zurück)
const { buffer: textBuffer, outMime: textMime } = await optimizeText(rawHtmlBuffer, 'text/html', 'balanced');

// 3. Audio / Video optimieren (gibt PassThrough Stream zurück)
const { stream, outMime: mediaMime } = optimizeMediaStream(rawVideoBuffer, 'video/mp4', 'quality');

// 4. TypeScript/React optimieren (gibt Buffer zurück)
const { buffer: tsBuffer, outMime: tsMime } = await optimizeEsbuild(rawTsBuffer, '.tsx', 'quality');

```

## Optimierungsmethoden

Condense bietet drei primäre Optimierungsziele:

* `quality` (Standard): Visuell verlustfreie, sichere Komprimierung, bewahrt die maximale Genauigkeit.
* `balanced`: Der optimale Mittelweg zwischen Dateigröße und Qualität. Führt eine leichte verlustbehaftete Komprimierung ein (z. B. 65 % Qualität bei JPEGs, crf 26 bei Videos).
* `extreme`: Maximale Komprimierung. Erzwingt Konvertierungen in moderne Formate (z. B. JPEG/PNG zu WebP/AVIF), entfernt Console-Logs, bereinigt benutzerdefinierte Abschnitte in WASM und skaliert Videos herunter.

## Ignorier-Anweisungen

Verwenden Sie Ignorier-Anweisungen, um die Minimierung für eine Datei oder einen bestimmten Bereich zu verhindern.

* `html`: Fügen Sie `data-condense-ignore` zu jedem Element hinzu (oder zu `<html>`, um das gesamte Dokument zu ignorieren).
* Code (`js`, `css`, `ts`, `jsx`, `tsx`, `less`, `scss`): Fügen Sie den Kommentar `/* condense-ignore */` an beliebiger Stelle in der Datei hinzu, um die Minimierung zu umgehen.

### Beispiele

#### `html`

```html
<div data-condense-ignore>
  <pre>
    Erhaltene Abstände und Inhalte hier
  </pre>
</div>

```

#### `js`/`ts`

```javascript
/* condense-ignore */
function legacyCode() {
    // Diese Datei wird nicht verändert
    var x =   10; 
}

```

## API-Referenz (Auswahl)

POST `/optimize`

* Multipart-Formular: `file` (Binärdatei), `method` (`quality` | `balanced` | `extreme`)
* Optionale Formular-/Query-Parameter: `width`, `height`, `fit`, `keepMetadata`, `keepFormat`, `targetFormat`, `faststart`, `thumbnail`.
* Gibt die optimierte Binärdatei im Antworttext mit dem entsprechenden `Content-Type` zurück.

### Beispielanfrage:

```bash
curl -X POST http://localhost:3000/optimize \
  -F "file=@./photo.png;type=image/png" \
  -F "method=balanced" \
  --output photo-condensed.png

```

Kurze Erklärung: Uploads werden im Arbeitsspeicher (Buffer oder Streams) empfangen, von Condense im Arbeitsspeicher verarbeitet, optional im LRU-Cache zwischengespeichert und als optimierter Buffer oder Stream ohne zwischenzeitliche Festplattenschreibvorgänge zurückgegeben.

## Benchmarks

Unten aufgeführt sind die Benchmark-Ergebnisse der Verarbeitung unserer Beispielsammlung durch die `Condense`-Pipeline unter Verwendung der Methoden `quality`, `balanced` und `extreme`. Weitere Informationen finden Sie im Verzeichnis [`demo`](https://github.com/studioframes/Condense/tree/main/demo).

| Dateiname | Originalgröße | Quality-Größe | Balanced-Größe | Extreme-Größe | Max Reduzierung |
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

## Systemanforderungen

* Mindestversion Node.js: >= 20.9

## Verhaltenskodex

Wir erwarten von den Projektteilnehmern, dass sie sich an den Verhaltenskodex des Repositories halten. Bitte lesen Sie [den vollständigen Text](https://github.com/studioframes/Condense/blob/main/CODE_OF_CONDUCT.md), damit Sie verstehen, welche Maßnahmen toleriert werden und welche nicht.

## Beitragen zu Condense

Wir begrüßen Beiträge von allen. Lesen Sie unseren [Leitfaden für Beiträge](https://github.com/studioframes/Condense/blob/main/CONTRIBUTING.md), um mehr über unseren Entwicklungsprozess zu erfahren, wie Sie Fehlerbehebungen und Verbesserungen vorschlagen und wie Sie Ihre Änderungen an Condense erstellen und testen können.

## Lizenz

Dieses Projekt wird von Studio Frames verwaltet und ist unter der Apache-Lizenz 2.0 lizenziert. Den vollständigen Text finden Sie unter [LICENSE](https://github.com/studioframes/Condense/blob/main/LICENSE).