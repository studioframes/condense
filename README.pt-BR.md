<div align="center">

![logo](https://github.com/user-attachments/assets/b7277c45-e2f2-4345-852b-47403b157f5d)

[![npm](https://conbadges.pages.dev/api/npm/v/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![downloads](https://conbadges.pages.dev/api/npm/dt/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![License](https://conbadges.pages.dev/api/badge?label=license&value=Apache-2.0)](./LICENSE)

**O Condense é um motor de minificação e otimização de arquivos stateless de alta performance para [Node.js](https://nodejs.org). Ele otimiza imagens, áudio, vídeo, código e WebAssembly inteiramente em memória usando Buffers e Streams, evitando a escrita de arquivos temporários no disco.**

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [Português (Brasil)](README.pt-BR.md) • [Deutsch](README.de.md) • [Français](README.fr.md)

</div>

## Introdução

O Condense oferece otimização rápida e em memória para mídias, códigos e binários. Ele foi criado para fornecer processamento stateless de baixa latência para ambientes de servidor e serverless onde o I/O de disco temporário é indesejado ou indisponível. Ao contrário das ferramentas tradicionais que dependem de arquivos temporários intermediários, o Condense processa uploads e recursos utilizando Buffers e Streams, retornando Buffers ou Streams otimizados prontos para serem enviados nas respostas HTTP.

### Sumário
- <a href="#why-condense">Por que Condense?</a>
- <a href="#features">Recursos</a>
- <a href="#supported-formats">Formatos Suportados</a>
- <a href="#installation">Instalação</a>
- <a href="#quick-start">Início Rápido</a>
- <a href="#usage">Uso</a>
- <a href="#ignore-directives">Diretivas de Ignoragem</a>
- <a href="#api-reference-selected">Referência da API</a>
- <a href="#benchmarks">Benchmarks</a>
- <a href="#system-requirements">Requisitos do Sistema</a>
- <a href="#code-of-conduct">Código de Conduta</a>
- <a href="#contributing-to-condense">Contribuição</a>
- <a href="#license">Licença</a>

## Por que Condense?

- **Sem arquivos temporários:** Processa arquivos inteiramente em memória usando Buffers e Streams sem escrever arquivos temporários no disco.
- **Arquitetura stateless:** As otimizações são executadas por requisição sem estado persistente, facilitando o escalonamento horizontal.
- **Pronto para APIs:** Projetado para se integrar de forma limpa em APIs HTTP e microsserviços.
- **Pronto para Serverless:** Funciona muito bem em ambientes efêmeros (Cloud Functions, ambientes de execução estilo Lambda) onde o acesso ao disco é limitado.
- **Alta taxa de transferência:** Pipelines eficientes adequados para o processamento de grandes volumes de mídia.
- **Baixa latência:** Otimizado para o mínimo de latência adicionada nos fluxos de requisição/resposta.

## Recursos
- Processamento em memória com Buffers & Streams (sem gravações temporárias em disco, exceto ao invocar explicitamente `faststart`)
- Otimização de imagens (incluindo AVIF & GIF), áudio, vídeo, código/marcação (incluindo SVG) e WebAssembly
- Redimensionamento Dinâmico Inteligente via parâmetros da API `width`, `height` e `fit`
- Extração de Miniaturas de Vídeo e utilitários padrão MP4 Faststart
- Middleware para Express e CLI independente com uma linda interface de terminal
- Diretivas de ignoragem para excluir regiões ou arquivos específicos da minificação
- Cache LRU integrado para recursos estáticos frequentemente otimizados (ativado via `CONDENSE_CACHE=true`)
- API de Diagnóstico de Saúde do Sistema (`/health`)

## Formatos Suportados

| Categoria | Formatos |
| --- | --- |
| Imagens | `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`, `.svg` |
| Áudio | `.mp3`, `.wav` |
| Vídeo | `.mp4` |
| Web | `.html`, `.css`, `.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `.xml`, `.yaml`, `.yml`, `.graphql`, `.less`, `.scss` |

## Instalação

Instale com o gerenciador de pacotes de sua preferência:

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

## Início Rápido

O exemplo mais simples em processo — otimize um Buffer de imagem e receba de volta um Buffer otimizado:

```javascript
const { optimizeImage } = require('@studioframes/condense');

async function simpleOptimize(rawBuffer) {
  const { buffer: optimized, outMime } = await optimizeImage(rawBuffer, 'image/png', 'quality');
  // envia `optimized` como o corpo da resposta HTTP com o Content-Type `outMime`
  return { optimized, outMime };
}

// Uso: passe un Buffer (ex: vindo de um upload de arquivo ou resposta de um fetch)

```

## Uso

O Condense pode ser executado como uma ferramenta CLI independente, como um servidor, montado como um middleware do Express ou usado de forma programática.

## Documentação

O conjunto de documentações foi expandido e agora está organizado tanto para novos usuários quanto para colaboradores. Comece pela central de documentos em [docs/README.md](https://www.google.com/search?q=./docs/README.md) e depois explore os guias mais detalhados abaixo:

* [docs/overview.md](https://www.google.com/search?q=./docs/overview.md) para uma visão geral do projeto e seus objetivos
* [docs/api.md](https://www.google.com/search?q=./docs/api.md) para opções de integração através do SDK, API HTTP e CLI
* [docs/architecture.md](https://www.google.com/search?q=./docs/architecture.md) para uma visão de alto nível da arquitetura do serviço
* [docs/cli.md](https://www.google.com/search?q=./docs/cli.md) para exemplos de uso da CLI e fluxos de trabalho em lote
* [docs/examples.md](https://www.google.com/search?q=./docs/examples.md) para trechos práticos do SDK e da CLI
* [docs/development.md](https://www.google.com/search?q=./docs/development.md) para configuração de ambiente local e orientações de contribuição
* [docs/configuration.md](https://www.google.com/search?q=./docs/configuration.md) para opções de requisição e configuração baseada em ambiente
* [docs/troubleshooting.md](https://www.google.com/search?q=./docs/troubleshooting.md) para problemas comuns e dicas de depuração
* [docs/deployment.md](https://www.google.com/search?q=./docs/deployment.md) para orientações de implantação em produção
* [docs/faq.md](https://www.google.com/search?q=./docs/faq.md) para perguntas e respostas comuns
* [MIGRATION_GUIDE.md](https://www.google.com/search?q=./MIGRATION_GUIDE.md) para notas de atualização de versão para versão
* [ECOSYSTEM/DEPENDENCIES.md](https://www.google.com/search?q=./ECOSYSTEM/DEPENDENCIES.md) para o inventário de dependências e a finalidade de cada pacote
* **Otimização via CLI:** `npx @studioframes/condense optimize ./src -o ./dist -m balanced` (Veja [COMMANDS.md](https://www.google.com/search?q=./COMMANDS.md) para a documentação completa da CLI)
* **Servidor:** `npx @studioframes/condense` (padrão na porta 3000; defina `PORT` para sobrescrever)
* **Express:** monte o `condenseApp` em uma rota para aceitar uploads
* **Programático:** use métodos auxiliares como `optimizeImage`, `optimizeText`, `optimizeMediaStream`, `optimizeEsbuild`, `optimizeWasm`

### Exemplos

#### Uso da CLI

O Condense v0.3.0 introduziu uma CLI estilizada e cheia de recursos:

```bash
# Otimiza uma única imagem com compressão extrema
npx @studioframes/condense optimize photo.png -o out.webp --method extreme

# Otimiza em lote um diretório usando o método balanceado
npx @studioframes/condense optimize ./src/ -o ./dist/ --method balanced

```

#### Middleware do Express

```javascript
const express = require('express');
const { condenseApp } = require('@studioframes/condense');

const app = express();

// Monte todas as rotas de otimização sob um caminho específico
app.use('/v1', condenseApp);

app.listen(8080, () => {
    console.log('App rodando. Faça POST de arquivos para http://localhost:8080/v1/optimize');
});

```

#### SDK Auxiliar Programático

```javascript
const { optimizeImage, optimizeText, optimizeMediaStream, optimizeEsbuild } = require('@studioframes/condense');

// 1. Otimizar um Buffer de Imagem (retorna Buffer)
const { buffer: imgBuffer, outMime: imgMime } = await optimizeImage(rawImageBuffer, 'image/png', 'extreme');

// 2. Otimizar um Buffer HTML / CSS / JS (retorna Buffer)
const { buffer: textBuffer, outMime: textMime } = await optimizeText(rawHtmlBuffer, 'text/html', 'balanced');

// 3. Otimizar Áudio / Vídeo (retorna PassThrough Stream)
const { stream, outMime: mediaMime } = optimizeMediaStream(rawVideoBuffer, 'video/mp4', 'quality');

// 4. Otimizar TypeScript/React (retorna Buffer)
const { buffer: tsBuffer, outMime: tsMime } = await optimizeEsbuild(rawTsBuffer, '.tsx', 'quality');

```

## Métodos de Otimização

O Condense oferece três alvos principais de otimização:

* `quality` (Padrão): Compressão visualmente sem perdas e segura, preserva a fidelidade máxima.
* `balanced` : O ponto ideal entre tamanho de arquivo e qualidade. Introduz uma compressão leve com perdas (ex: 65% de qualidade para JPEGs, crf 26 para vídeo).
* `extreme`: Compressão máxima. Força conversões para formatos modernos (ex: JPEG/PNG para WebP/AVIF), remove console.logs, limpa seções personalizadas do WASM e reduz a resolução de vídeos.

## Diretivas de Ignoragem

Use diretivas de ignoragem para evitar a minificação de um arquivo ou de uma região específica.

* `html`: adicione `data-condense-ignore` a qualquer elemento (ou à tag `<html>` para ignorar o documento inteiro).
* Código (`js`, `css`, `ts`, `jsx`, `tsx`, `less`, `scss`): adicione o comentário `/* condense-ignore */` em qualquer lugar do arquivo para ignorar a minificação.

### Exemplos

#### `html`

```html
<div data-condense-ignore>
  <pre>
    Espaçamentos e conteúdo preservados aqui
  </pre>
</div>

```

#### `js`/`ts`

```javascript
/* condense-ignore */
function legacyCode() {
    // Este arquivo não será alterado
    var x =   10; 
}

```

## Referência da API (selecionada)

POST `/optimize`

* Formário Multipart: `file` (binário), `method` (`quality` | `balanced` | `extreme`)
* Parâmetros opcionais de formulário/query: `width`, `height`, `fit`, `keepMetadata`, `keepFormat`, `targetFormat`, `faststart`, `thumbnail`.
* Retorna o binário otimizado no corpo da resposta com o `Content-Type` adequado.

### Exemplo de Requisição:

```bash
curl -X POST http://localhost:3000/optimize \
  -F "file=@./photo.png;type=image/png" \
  -F "method=balanced" \
  --output photo-condensed.png

```

Breve explicação: os uploads são recebidos na memória (Buffers ou Streams), processados pelo Condense em memória, opcionalmente cacheados no cache LRU e retornados como um Buffer ou Stream otimizado, sem escritas intermediárias no disco.

## Benchmarks

Abaixo estão os resultados de benchmark do processamento do nosso conjunto de amostras através do pipeline do `Condense` usando os métodos `quality`, `balanced` e `extreme`. Consulte o diretório [`demo`](https://github.com/studioframes/Condense/tree/main/demo) para saber mais.

| Nome do Arquivo | Tamanho Original | Tamanho Quality | Tamanho Balanced | Tamanho Extreme | Redução Máxima |
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

## Requisitos do Sistema

* Node.js Mínimo: >= 20.9

## Código de Conduta

Esperamos que os participantes do projeto sigam o código de conduta do repositório. Por favor, leia [o texto completo](https://github.com/studioframes/Condense/blob/main/CODE_OF_CONDUCT.md) para entender quais ações serão ou não toleradas.

## Contribuindo com o Condense

Contribuições de todos são muito bem-vindas. Leia nosso [guia de contribuição](https://github.com/studioframes/Condense/blob/main/CONTRIBUTING.md) para conhecer nosso processo de desenvolvimento, como propor correções de bugs e melhorias, e como compilar e testar suas alterações no Condense.

## Licença

Este projeto é gerenciado pela Studio Frames e está licenciado sob a Licença Apache 2.0. Consulte o arquivo [LICENSE](https://github.com/studioframes/Condense/blob/main/LICENSE) para obter o texto completo.