<div align="center">

[![logo](https://github.com/user-attachments/assets/7c1cebfa-f186-4dab-9dc1-fee7474a30dc)](https://condense.js.org)

[![npm](https://conbadges.pages.dev/api/npm/v/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![downloads](https://conbadges.pages.dev/api/npm/dt/@studioframes/condense)](https://www.npmjs.com/package/@studioframes/condense)
[![License](https://conbadges.pages.dev/api/badge?label=license&value=Apache-2.0)](./LICENSE)

**[Condense](https://condense.js.org) 是一款专为 [Node.js](https://nodejs.org) 打造的高性能、无状态文件优化与代码压缩引擎。它完全在内存中利用 Buffer 和 Stream 对图像、音频、视频、代码以及 WebAssembly 进行优化，彻底避免了向磁盘写入临时文件的操作。**

[English](README.md) • [简体中文](README.zh-CN.md) • [Español](README.es.md) • [Português (Brasil)](README.pt-BR.md) • [Deutsch](README.de.md) • [Français](README.fr.md)

</div>

## 简介

Condense 为媒体文件、代码和二进制文件提供快速的内存中优化。它旨在为不需要或无法进行临时磁盘 I/O 的服务端及无服务器（Serverless）环境提供低延迟、无状态的处理能力。与传统依赖中间临时文件的工具不同，Condense 使用 Buffer 和 Stream 处理上传的文件与资源，并直接返回优化后的 Buffer 或 Stream，以便直接在响应中发送。

### 目录
- <a href="#why-condense">为什么选择 Condense？</a>
- <a href="#features">功能特性</a>
- <a href="#supported-formats">支持的格式</a>
- <a href="#installation">安装指南</a>
- <a href="#quick-start">快速上手</a>
- <a href="#usage">使用方法</a>
- <a href="#ignore-directives">忽略指令</a>
- <a href="#api-reference-selected">API 参考</a>
- <a href="#benchmarks">基准测试</a>
- <a href="#system-requirements">系统要求</a>
- <a href="#code-of-conduct">行为准则</a>
- <a href="#contributing-to-condense">参与贡献</a>
- <a href="#license">开源协议</a>

## 为什么选择 Condense？

- **无临时文件：** 完全在内存中使用 Buffer 和 Stream 处理文件，不会向磁盘写入任何临时文件。
- **无状态架构：** 优化操作按单次请求执行，不依赖持久化状态，极其易于水平扩展。
- **API 友好：** 专为无缝集成到 HTTP API 和微服务中而设计。
- **完美适配 Serverless：** 适用于磁盘访问受限的瞬时运行环境（如 Cloud Functions、类似 Lambda 的运行时）。
- **高吞吐量：** 高效的处理管线，轻松应对大规模的媒体文件处理需求。
- **低延迟：** 经过深度优化，将请求/响应流程中增加的延迟降至最低。

## 功能特性
- 内存中 Buffer 与 Stream 处理（除非显式调用 `faststart`，否则绝不进行临时磁盘写入）
- 图像（包括 AVIF 与 GIF）、音频、视频、代码/标记语言（包括 SVG）以及 WebAssembly 的优化
- 通过 `width`、`height` 和 `fit` 等 API 参数实现智能动态裁剪与缩放
- 视频缩略图提取与标准 MP4 Faststart（快速启动）实用工具
- 拥有精美终端 UI 的 Express 中间件与独立 CLI 工具
- 忽略指令：支持在特定文件或区域中主动跳过压缩处理
- 内置 LRU 缓存，用于加速频繁优化的静态资源（通过 `CONDENSE_CACHE=true` 开启）
- 系统健康检查诊断 API (`/health`)

## 支持的格式

| 类别 | 支持格式 |
| --- | --- |
| 图像 | `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.gif`, `.svg` |
| 音频 | `.mp3`, `.wav` |
| 视频 | `.mp4` |
| Web 代码 | `.html`, `.css`, `.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `.xml`, `.yaml`, `.yml`, `.graphql`, `.less`, `.scss` |

## 安装指南

请使用您首选的包管理器进行安装：

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

## 快速上手

以下是最简单的进程内示例 —— 优化一个图像 Buffer 并获取优化后的 Buffer：

```javascript
const { optimizeImage } = require('@studioframes/condense');

async function simpleOptimize(rawBuffer) {
  const { buffer: optimized, outMime } = await optimizeImage(rawBuffer, 'image/png', 'quality');
  // 将 `optimized` 作为 HTTP 响应体发送，并设置 Content-Type 为 `outMime`
  return { optimized, outMime };
}

// 使用方法：传入一个 Buffer（例如来自文件上传或 fetch 响应）

```

## 使用方法

Condense 可以作为独立的 CLI 工具运行、作为独立服务器启动、挂载为 Express 中间件，或者在代码中通过 SDK 调用。

## 文档

我们的文档现已全面扩充，方便新用户和贡献者查阅。请从文档中心 [docs/README.md](https://www.google.com/search?q=./docs/README.md) 开始，并浏览以下深度指南：

* [docs/overview.md](https://www.google.com/search?q=./docs/overview.md) 项目概述与设计目标
* [docs/api.md](https://www.google.com/search?q=./docs/api.md) 通过 SDK、HTTP API 和 CLI 进行集成的选项
* [docs/architecture.md](https://www.google.com/search?q=./docs/architecture.md) 服务架构的高级解析
* [docs/cli.md](https://www.google.com/search?q=./docs/cli.md) CLI 使用示例与批量处理工作流
* [docs/examples.md](https://www.google.com/search?q=./docs/examples.md) 实用的 SDK 与 CLI 代码片段
* [docs/development.md](https://www.google.com/search?q=./docs/development.md) 本地开发环境搭建与贡献指南
* [docs/configuration.md](https://www.google.com/search?q=./docs/configuration.md) 请求配置参数与基于环境变量的配置
* [docs/troubleshooting.md](https://www.google.com/search?q=./docs/troubleshooting.md) 常见问题与调试技巧
* [docs/deployment.md](https://www.google.com/search?q=./docs/deployment.md) 生产环境部署指南
* [docs/faq.md](https://www.google.com/search?q=./docs/faq.md) 常见问题解答
* [MIGRATION_GUIDE.md](https://www.google.com/search?q=./MIGRATION_GUIDE.md) 版本升级与迁移指南
* [ECOSYSTEM/DEPENDENCIES.md](https://www.google.com/search?q=./ECOSYSTEM/DEPENDENCIES.md) 依赖库清单及其具体用途
* **CLI 优化：** `npx @studioframes/condense optimize ./src -o ./dist -m balanced`（完整 CLI 文档请参见 [COMMANDS.md](https://www.google.com/search?q=./COMMANDS.md)）
* **服务器模式：** `npx @studioframes/condense`（默认端口为 3000；可通过设置 `PORT` 环境变量来更改）
* **Express 中间件：** 将 `condenseApp` 挂载到指定路由以接收上传文件
* **编程式调用：** 使用内置的辅助函数，如 `optimizeImage`、`optimizeText`、`optimizeMediaStream`、`optimizeEsbuild`、`optimizeWasm`

### 代码示例

#### CLI 使用

Condense v0.3.0 引入了视觉效果精美、功能齐全的 CLI 工具：

```bash
# 采用极致压缩模式（extreme）优化单张图片
npx @studioframes/condense optimize photo.png -o out.webp --method extreme

# 采用平衡模式（balanced）批量优化整个目录
npx @studioframes/condense optimize ./src/ -o ./dist/ --method balanced

```

#### Express 中间件

```javascript
const express = require('express');
const { condenseApp } = require('@studioframes/condense');

const app = express();

// 将所有优化路由挂载到特定路径下
app.use('/v1', condenseApp);

app.listen(8080, () => {
    console.log('应用已启动。请向 http://localhost:8080/v1/optimize 发送 POST 请求上传文件');
});

```

#### 编程式辅助 SDK

```javascript
const { optimizeImage, optimizeText, optimizeMediaStream, optimizeEsbuild } = require('@studioframes/condense');

// 1. 优化图像 Buffer（返回 Buffer）
const { buffer: imgBuffer, outMime: imgMime } = await optimizeImage(rawImageBuffer, 'image/png', 'extreme');

// 2. 优化 HTML / CSS / JS Buffer（返回 Buffer）
const { buffer: textBuffer, outMime: textMime } = await optimizeText(rawHtmlBuffer, 'text/html', 'balanced');

// 3. 优化音频 / 视频（返回 PassThrough Stream）
const { stream, outMime: mediaMime } = optimizeMediaStream(rawVideoBuffer, 'video/mp4', 'quality');

// 4. 优化 TypeScript / React（返回 Buffer）
const { buffer: tsBuffer, outMime: tsMime } = await optimizeEsbuild(rawTsBuffer, '.tsx', 'quality');

```

## 优化模式

Condense 提供了三种主要的优化策略目标：

* `quality`（默认）：视觉无损、安全压缩，最大程度保留原始精细度。
* `balanced`：在文件体积与文件质量之间取得完美平衡。引入轻微的有损压缩（例如 JPEG 保持 65% 质量，视频采用 crf 26）。
* `extreme`：最大化压缩率。强制转换为现代化格式（如 JPEG/PNG 转换为 WebP/AVIF）、移除代码中的 `console.log`、擦除 WASM 的自定义区块（custom sections），并对视频进行降采样。

## 忽略指令

您可以使用忽略指令来阻止对特定文件或特定代码区域进行代码压缩。

* `html`：在任意元素上添加 `data-condense-ignore` 属性（或在 `<html>` 标签上添加以忽略整个文档）。
* 代码（`js`, `css`, `ts`, `jsx`, `tsx`, `less`, `scss`）：在文件内的任意位置添加 `/* condense-ignore */` 注释即可绕过压缩。

### 示例

#### `html`

```html
<div data-condense-ignore>
  <pre>
    此处的空格和内容都将原样保留
  </pre>
</div>

```

#### `js`/`ts`

```javascript
/* condense-ignore */
function legacyCode() {
    // 该文件将不会被任何优化修改
    var x =   10; 
}

```

## API 参考（部分摘录）

POST `/optimize`

* Multipart 表单参数：`file`（二进制文件）, `method` (`quality` | `balanced` | `extreme`)
* 可选的表单/查询参数：`width`, `height`, `fit`, `keepMetadata`, `keepFormat`, `targetFormat`, `faststart`, `thumbnail`。
* 返回值：在响应体中直接返回优化后的二进制数据，并附带正确的 `Content-Type`。

### 请求示例：

```bash
curl -X POST http://localhost:3000/optimize \
  -F "file=@./photo.png;type=image/png" \
  -F "method=balanced" \
  --output photo-condensed.png

```

简要原理：上传的文件被直接接收到内存中（Buffer 或 Stream），由 Condense 在内存中完成处理，（可选）存储到 LRU 缓存中，最终作为优化后的 Buffer 或 Stream 返回，期间绝不写入任何中间磁盘临时文件。

## 基准测试

以下是使用 `quality`、`balanced` 和 `extreme` 三种模式通过 `Condense` 管线处理示例测试集的结果。欲了解更多信息，请参阅 [`demo`](https://github.com/studioframes/Condense/tree/main/demo) 目录。

| 文件名称 | 原始大小 | Quality 模式大小 | Balanced 模式大小 | Extreme 模式大小 | 最大缩减比例 |
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

## 系统要求

* 最低 Node.js 版本：>= 20.9

## 行为准则

我们希望所有项目参与者都能遵守本仓库的行为准则。请阅读 [全文](https://github.com/studioframes/Condense/blob/main/CODE_OF_CONDUCT.md) 以便了解哪些行为是受欢迎的，哪些是不被容忍的。

## 参与贡献

我们欢迎所有人为 Condense 贡献力量。请阅读我们的 [贡献指南](https://github.com/studioframes/Condense/blob/main/CONTRIBUTING.md) 以了解我们的开发流程、如何提出错误修复和改进建议，以及如何构建和测试您对 Condense 的修改。

## 开源协议

本项目由 Studio Frames 维护并基于 Apache License 2.0 协议开源。请参阅 [LICENSE](https://github.com/studioframes/Condense/blob/main/LICENSE) 了解完整条款。