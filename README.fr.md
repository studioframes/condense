<div align="center">

[![logo](https://github.com/user-attachments/assets/7c1cebfa-f186-4dab-9dc1-fee7474a30dc)](https://condense.js.org)

[![npm](https://conbadges.pages.dev/api/npm/v/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![downloads](https://conbadges.pages.dev/api/npm/dt/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![License](https://conbadges.pages.dev/api/badge?label=license&value=Apache-2.0)](./LICENSE)

**[Condense](https://condense.js.org) est un moteur d'optimisation et de minification de fichiers sans état (stateless) et haute performance pour [Node.js](https://nodejs.org). Il optimise les images, l'audio, la vidéo, le code et WebAssembly entièrement en mémoire à l'aide de Buffers et de Streams, et évite l'écriture de fichiers temporaires sur le disque.**

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [Português (Brasil)](README.pt-BR.md) • [Deutsch](README.de.md) • [Français](README.fr.md)

</div>

## Introduction

Condense fournit une optimisation rapide en mémoire pour les médias, le code et les fichiers binaires. Il a été conçu pour offrir un traitement sans état à faible latence pour les environnements serveur et serverless où les E/S disque temporaires ne sont pas souhaitables ou indisponibles. Contrairement aux outils traditionnels qui s'appuient sur des fichiers temporaires intermédiaires, Condense traite les téléchargements et les ressources à l'aide de Buffers et de Streams, renvoyant des Buffers ou des Streams optimisés prêts à être envoyés dans les réponses.

### Table des matières
- <a href="#why-condense">Pourquoi Condense ?</a>
- <a href="#features">Fonctionnalités</a>
- <a href="#supported-formats">Formats pris en charge</a>
- <a href="#installation">Installation</a>
- <a href="#quick-start">Démarrage rapide</a>
- <a href="#usage">Utilisation</a>
- <a href="#ignore-directives">Directives d'ignoration</a>
- <a href="#api-reference-selected">Référence API</a>
- <a href="#benchmarks">Benchmarks</a>
- <a href="#system-requirements">Configuration requise</a>
- <a href="#code-of-conduct">Code de conduite</a>
- <a href="#contributing-to-condense">Contribution</a>
- <a href="#license">Licence</a>

## Pourquoi Condense ?

- **Aucun fichier temporaire :** Traite les fichiers entièrement en mémoire à l'aide de Buffers et de Streams sans écrire de fichiers temporaires sur le disque.
- **Architecture sans état (stateless) :** Les optimisations sont effectuées par requête sans état persistant, facilitant la mise à l'échelle horizontale.
- **Adapté aux API :** Conçu pour s'intégrer proprement dans les API HTTP et les microservices.
- **Prêt pour le Serverless :** Fonctionne parfaitement dans les environnements éphémères (Cloud Functions, runtimes de type Lambda) où l'accès au disque est limité.
- **Débit élevé :** Des pipelines efficaces adaptés au traitement de volumes importants de médias.
- **Faible latence :** Optimisé pour une latence supplémentaire minimale dans les flux de requête/réponse.

## Fonctionnalités
- Traitement en mémoire par Buffer et Stream (aucune écriture temporaire sur disque, sauf en cas d'invocation explicite de `faststart`)
- Optimisation d'images (y compris AVIF & GIF), audio, vidéo, code/balisage (y compris SVG) et WebAssembly
- Redimensionnement dynamique intelligent via les paramètres d'API `width`, `height` et `fit`
- Extraction de miniatures vidéo et utilitaires standard MP4 Faststart
- Middleware Express et CLI autonome avec une interface terminal soignée
- Directives d'ignoration pour exclure des régions ou des fichiers spécifiques de la minification
- Cache LRU intégré pour les ressources statiques fréquemment optimisées (activé via `CONDENSE_CACHE=true`)
- API de diagnostic de l'état du système (`/health`)

## Formats pris en charge

| Catégorie | Formats |
| --- | --- |
| Images | `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`, `.svg` |
| Audio | `.mp3`, `.wav` |
| Vidéo | `.mp4` |
| Web | `.html`, `.css`, `.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `.xml`, `.yaml`, `.yml`, `.graphql`, `.less`, `.scss` |

## Installation

Installez avec votre gestionnaire de paquets préféré :

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

## Démarrage rapide

L'exemple le plus simple en cours de processus — optimisez un Buffer d'image et récupérez un Buffer optimisé :

```javascript
const { optimizeImage } = require('@studioframes/condense');

async function simpleOptimize(rawBuffer) {
  const { buffer: optimized, outMime } = await optimizeImage(rawBuffer, 'image/png', 'quality');
  // envoyer `optimized` comme corps de réponse HTTP avec le Content-Type `outMime`
  return { optimized, outMime };
}

// Utilisation : passez un Buffer (par exemple, provenant d'un téléchargement de fichier ou d'une réponse fetch)

```

## Utilisation

Condense peut être exécuté en tant qu'outil CLI autonome, en tant que serveur, être monté en tant que middleware Express, ou être utilisé de manière programmatique.

## Documentation

L'ensemble de la documentation a été enrichi et est désormais organisé à la fois pour les nouveaux utilisateurs et les contributeurs. Commencez par le hub de documentation dans [docs/README.md](./docs/README.md), puis explorez les guides plus détaillés ci-dessous :

* [docs/overview.md](./docs/overview.md) pour un aperçu du projet et de ses objectifs
* [docs/api.md](./docs/api.md) pour las options d'intégration via le SDK, l'API HTTP et la CLI
* [docs/architecture.md](./docs/architecture.md) pour un aperçu de haut niveau de l'architecture du service
* [docs/cli.md](./docs/cli.md) pour des exemples d'utilisation de la CLI et des flux de travail par lots
* [docs/examples.md](./docs/examples.md) pour des extraits pratiques du SDK et de la CLI
* [docs/development.md](./docs/development.md) pour la configuration locale et les conseils de contribution
* [docs/configuration.md](./docs/configuration.md) pour les options de requête et la configuration basée sur l'environnement
* [docs/troubleshooting.md](./docs/troubleshooting.md) pour les problèmes courants et les conseils de débogage
* [docs/deployment.md](./docs/deployment.md) pour les conseils de déploiement en production
* [docs/faq.md](./docs/faq.md) pour les questions fréquemment posées
* [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) pour les notes de mise à niveau de version à version
* [ECOSYSTEM/DEPENDENCIES.md](./ECOSYSTEM/DEPENDENCIES.md) pour l'inventaire des dépendances et l'objectif de chaque paquet
* **Optimisation CLI :** `npx @studioframes/condense optimize ./src -o ./dist -m balanced` (Voir [COMMANDS.md](./COMMANDS.md) pour la documentation complète de la CLI)
* **Serveur :** `npx @studioframes/condense` (par défaut sur le port 3000 ; définissez `PORT` pour remplacer)
* **Express :** montez `condenseApp` sur une route pour accepter les téléchargements
* **Programmatique :** utilisez des assistants tels que `optimizeImage`, `optimizeText`, `optimizeMediaStream`, `optimizeEsbuild`, `optimizeWasm`

### Exemples

#### Utilisation de la CLI

Condense v0.3.0 a introduit une CLI stylisée et complète :

```bash
# Optimiser une seule image avec une compression extrême
npx @studioframes/condense optimize photo.png -o out.webp --method extreme

# Optimiser par lots un répertoire en utilisant la méthode équilibrée (balanced)
npx @studioframes/condense optimize ./src/ -o ./dist/ --method balanced

```

#### Middleware Express

```javascript
const express = require('express');
const { condenseApp } = require('@studioframes/condense');

const app = express();

// Monter toutes les routes d'optimisation sous un chemin spécifique
app.use('/v1', condenseApp);

app.listen(8080, () => {
    console.log('Application en cours d\'exécution. Envoyez des fichiers par POST à http://localhost:8080/v1/optimize');
});

```

#### SDK d'assistance programmatique

```javascript
const { optimizeImage, optimizeText, optimizeMediaStream, optimizeEsbuild } = require('@studioframes/condense');

// 1. Optimiser un Buffer d'image (renvoie un Buffer)
const { buffer: imgBuffer, outMime: imgMime } = await optimizeImage(rawImageBuffer, 'image/png', 'extreme');

// 2. Optimiser un Buffer HTML / CSS / JS (renvoie un Buffer)
const { buffer: textBuffer, outMime: textMime } = await optimizeText(rawHtmlBuffer, 'text/html', 'balanced');

// 3. Optimiser l'audio / la vidéo (renvoie un Stream PassThrough)
const { stream, outMime: mediaMime } = optimizeMediaStream(rawVideoBuffer, 'video/mp4', 'quality');

// 4. Optimiser TypeScript/React (renvoie un Buffer)
const { buffer: tsBuffer, outMime: tsMime } = await optimizeEsbuild(rawTsBuffer, '.tsx', 'quality');

```

## Méthodes d'optimisation

Condense fournit trois cibles d'optimisation principales :

* `quality` (Par défaut) : Compression visuellement sans perte, sûre, préserve une fidélité maximale.
* `balanced` : Le juste milieu entre la taille du fichier et la qualité. Introduit une légère compression avec perte (par exemple, 65 % de qualité pour les JPEG, crf 26 pour la vidéo).
* `extreme` : Compression maximale. Force les conversions vers des formats modernes (par exemple, JPEG/PNG vers WebP/AVIF), supprime les console.logs, élimine les sections personnalisées WASM et réduit la résolution vidéo.

## Directives d'ignoration

Utilisez des directives d'ignoration pour empêcher la minification d'un fichier ou d'une région spécifique.

* `html` : ajoutez `data-condense-ignore` à n'importe quel élément (ou à `<html>` pour ignorer tout le document).
* Code (`js`, `css`, `ts`, `jsx`, `tsx`, `less`, `scss`) : ajoutez le commentaire `/* condense-ignore */` n'importe où dans le fichier pour contourner la minification.

### Exemples

#### `html`

```html
<div data-condense-ignore>
  <pre>
    Espacement et contenu préservés ici
  </pre>
</div>

```

#### `js`/`ts`

```javascript
/* condense-ignore */
function legacyCode() {
    // Ce fichier ne sera pas modifié
    var x =   10; 
}

```

## Référence API (sélection)

POST `/optimize`

* Formulaire Multipart : `file` (binaire), `method` (`quality` | `balanced` | `extreme`)
* Paramètres optionnels de formulaire/requête : `width`, `height`, `fit`, `keepMetadata`, `keepFormat`, `targetFormat`, `faststart`, `thumbnail`.
* Renvoie le binaire optimisé dans le corps de la réponse avec le `Content-Type` approprié.

### Exemple de requête :

```bash
curl -X POST http://localhost:3000/optimize \
  -F "file=@./photo.png;type=image/png" \
  -F "method=balanced" \
  --output photo-condensed.png

```

Explication rapide : les fichiers téléchargés sont reçus en mémoire (Buffers ou Streams), traités par Condense en mémoire, éventuellement mis en cache dans le cache LRU, et renvoyés sous forme de Buffer ou de Stream optimisé sans écritures intermédiaires sur le disque.

## Benchmarks

Vous trouverez ci-dessous les résultats des benchmarks du traitement de notre suite d'échantillons via le pipeline `Condense` en utilisant las méthodes `quality`, `balanced` et `extreme`. Consultez le répertoire [`demo`](https://github.com/studioframes/Condense/tree/main/demo) pour en savoir plus.

| Nom du fichier | Taille d'origine | Taille Quality | Taille Balanced | Taille Extreme | Réduction max |
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

## Configuration requise

* Node.js minimum : >= 20.9

## Code de conduite

Nous attendons des participants au projet qu'ils respectent le code de conduite du dépôt. Veuillez lire [le texte intégral](https://github.com/studioframes/Condense/blob/main/CODE_OF_CONDUCT.md) afin de comprendre quelles actions seront ou ne seront pas tolérées.

## Contribution à Condense

Les contributions de chacun sont les bienvenues. Lisez notre [guide de contribution](https://github.com/studioframes/Condense/blob/main/CONTRIBUTING.md) pour en savoir plus sur notre processus de développement, sur la façon de proposer des corrections de bugs et des améliorations, et sur la façon de construire et de tester vos modifications sur Condense.

## Licence

Ce projet est géré par Studio Frames et est sous licence Apache License 2.0. Voir [LICENSE](https://github.com/studioframes/Condense/blob/main/LICENSE) pour le texte complet.