
<div align="center">
  <img src="./public/icon.svg" alt="BooruPrompt App Icon" width="120" height="120">

  <h1>BooruPrompt — Booru Tag Extractor & Image Metadata Toolkit</h1>

  <p>
    <b>Extract, categorize, filter, and copy tags from popular booru sites — fast, accurate, and delightful.</b>
  </p>

  <p>
    <a href="https://booruprompt.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-Visit-1f6feb?style=for-the-badge&logo=vercel&logoColor=white"></a>
    <a href="https://github.com/IRedDragonICY/booruprompt"><img alt="GitHub Repo" src="https://img.shields.io/badge/GitHub-Repository-24292e?style=for-the-badge&logo=github&logoColor=white"></a>
    <a href="https://github.com/IRedDragonICY/booruprompt/issues"><img alt="Issues" src="https://img.shields.io/badge/Issues-Track-238636?style=for-the-badge&logo=github&logoColor=white"></a>
  </p>

  <p>
    <a href="https://github.com/IRedDragonICY/booruprompt/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square"></a>
    <img alt="Status" src="https://img.shields.io/badge/Status-Active-success.svg?style=flat-square">
    <img alt="Platforms" src="https://img.shields.io/badge/Platforms-Web%20·%20Desktop%20(Tauri)%20·%20Android-0ea5e9.svg?style=flat-square">
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white">
    <img alt="React" src="https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white">
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white">
    <img alt="Framer Motion" src="https://img.shields.io/badge/Framer%20Motion-12-0055ff?style=flat-square&logo=framer&logoColor=white">
    <img alt="Tauri" src="https://img.shields.io/badge/Tauri-2-fb923c?style=flat-square&logo=tauri&logoColor=white">
  </p>
</div>

<p align="center">
  <img src="https://github.com/user-attachments/assets/f7680d50-595e-4e4e-9375-21b4f7eced81" alt="BooruPrompt Screenshot" width="78%">
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#supported-sites"><strong>Supported Sites</strong></a> ·
  <a href="#api"><strong>API</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#desktop--android"><strong>Desktop & Android</strong></a> ·
  <a href="#faq"><strong>FAQ</strong></a>
</p>

---

## Why BooruPrompt?

Designed for creators, curators, and prompt engineers who need reliable tags quickly. Paste a post URL, get clean, categorized tags and a preview — ready to copy into your workflow.

## Features

<table>
  <tr>
    <td valign="top" width="25%">
      <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/auto-fix.svg" width="22" height="22" alt="Auto" />
      <b>Automatic Extraction</b>
      <br/>
      Paste a post URL and let the app extract tags instantly (auto/manual modes).
    </td>
    <td valign="top" width="25%">
      <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/tag-multiple-outline.svg" width="22" height="22" alt="Tags" />
      <b>Smart Categorization</b>
      <br/>
      Organized into Copyright, Character, General, Meta, and Other.
    </td>
    <td valign="top" width="25%">
      <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/filter-variant.svg" width="22" height="22" alt="Filter" />
      <b>Intuitive Filtering</b>
      <br/>
      Toggle categories and blacklist unwanted keywords.
    </td>
    <td valign="top" width="25%">
      <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/content-copy.svg" width="22" height="22" alt="Copy" />
      <b>One‑Click Copy</b>
      <br/>
      Copy clean, comma‑separated tags in one click or via keyboard.
    </td>
  </tr>
  <tr>
    <td valign="top">
      <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/monitor-cellphone.svg" width="22" height="22" alt="Responsive" />
      <b>Responsive UI</b>
      <br/>
      Optimized for desktop, tablet, and mobile — fluid and fast.
    </td>
    <td valign="top">
      <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/theme-light-dark.svg" width="22" height="22" alt="Theme" />
      <b>Dark Mode & Themes</b>
      <br/>
      System/dark mode plus color theme customization.
    </td>
    <td valign="top">
      <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/file-document-outline.svg" width="22" height="22" alt="Metadata" />
      <b>PNG Metadata</b>
      <br/>
      Extract Positive/Negative prompts and parameters from PNG files.
    </td>
    <td valign="top">
      <img src="https://cdn.jsdelivr.net/npm/@mdi/svg/svg/cloud-download-outline.svg" width="22" height="22" alt="Proxy" />
      <b>Flexible Fetching</b>
      <br/>
      Server proxy by default; optional client proxies (AllOrigins, etc.).
    </td>
  </tr>
</table>

### Highlights

- <b>Real‑world resilient</b>: Handles site quirks, timeouts, referers (Pixiv), and fallback flows.
- <b>History</b>: Optional local history for extractions and image metadata.
- <b>Privacy‑aware</b>: No analytics; data stays on your device (server proxy only fetches, doesn’t store).

## Supported Sites

The extractor currently supports these sites and post formats:

| Site | Status |
|:--|:--|
| Danbooru | Supported |
| Safebooru (Donmai) | Supported |
| Hijiribe (Donmai) | Supported |
| Safebooru (Org) | Supported |
| Gelbooru | Supported |
| Rule34 | Supported |
| TBIB | Supported |
| Scatbooru | Supported |
| Garycbooru | Supported |
| e621 | Supported |
| AIBooru | Supported |
| Yande.re | Supported |
| Konachan | Supported |
| Anime‑Pictures | Supported |
| Zerochan | Supported |
| E‑Shuushuu | Supported |
| Pixiv | Supported (JSON/pximg fallbacks) |
| Fur Affinity | Supported |

> Tip: You can enable a similarity fallback for some unsupported `donmai.us` subdomains in settings.

## Architecture at a Glance

```mermaid
flowchart LR
  A[Browser UI] -->|POST /api/fetch-booru| B[Next.js API (Node)]
  B -->|fetch target HTML with UA + referer| C[Target Booru Site]
  B -->|extract tags + image + title| D[JSON Response]
  A -->|GET /api/fetch-booru?imageUrl=...| B
  B -->|stream image/video with cache headers| A
```

## API

Base URL: `https://booruprompt.vercel.app/api/fetch-booru`

### 1) Extract From Page (POST)

- Endpoint: `/api/fetch-booru`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:

```json
{ "targetUrl": "https://safebooru.org/index.php?page=post&s=view&id=12345" }
```

- Success 200:

```json
{ "siteName": "Gelbooru", "tags": { "general": ["1girl", "smile"], "character": ["..." ] }, "imageUrl": "https://...jpg", "title": "..." }
```

- Errors: `400 | 422 | 502 | 504` with `{ error, status }` message.

### 2) Proxy Image (GET)

- Endpoint: `/api/fetch-booru?imageUrl=...` (URL‑encode the value)
- Returns raw image/video with `Content-Type` and `Cache-Control` preserved.

Notes:
- Uses a mainstream browser User‑Agent and sets `Referer` for `i.pximg.net` (Pixiv).
- Request timeout: 25s.

#### Curl Examples

```bash
# POST: extract page
curl -X POST "https://booruprompt.vercel.app/api/fetch-booru" \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://gelbooru.com/index.php?page=post&s=view&id=123"}'

# GET: proxy image
curl "https://booruprompt.vercel.app/api/fetch-booru?imageUrl=https%3A%2F%2Fe621.net%2Fdata%2F...jpg" -o out.jpg
```

## Getting Started

Prerequisites: Node.js ≥ 18

```bash
git clone https://github.com/IRedDragonICY/booruprompt.git
cd booruprompt
npm install
npm run dev
```

Open `http://localhost:3000`.

### Usage

1. Paste a booru post URL (e.g. `https://danbooru.donmai.us/posts/123456`).
2. Auto‑extract will run (or click Extract Manually).
3. Toggle categories and optional blacklist.
4. Copy tags.

Keyboard: `Ctrl/Cmd + C` copies filtered tags when the extractor view is active.

## Desktop & Android

This project ships with a Tauri app configuration and Android tooling.

### Desktop (Tauri)

```bash
# Dev (opens a desktop window pointing to localhost)
npm run tauri:dev

# Production build (bundles app installers)
npm run tauri:build
```

Static export helper used by Tauri:

```bash
npm run tauri:export
```

### Android (Experimental)

```bash
# One‑time setup
npm run android:init

# Run on device / emulator
npm run android:dev

# Build APK/AAB (debug)
npm run android:build
```

## Tech Stack

- Next.js 15 (App Router), React 19, TypeScript 5
- Tailwind CSS 4, Framer Motion 12
- Tauri 2 for desktop bundling

## SEO — Keywords

booru tag extractor, danbooru tags, gelbooru tags, e621 tags, pixiv tags, rule34 tags, booru prompt generator, copy booru tags, booru tag parser, tag categorization, booru proxy api, anime tags extractor, ai prompt tags, image metadata prompt extractor

## FAQ

- <b>Why do some pages fail?</b> Some sites require login, use anti‑bot protections (e.g., Cloudflare), or return empty HTML via proxies.
- <b>Is my data stored?</b> No server‑side storage. Optional local history is stored in your browser only.
- <b>Pixiv images don’t load?</b> The proxy sets a Pixiv `Referer` and prefers `i.pximg.net`. See API image proxy notes.

## Contributing

Issues and PRs are welcome. Please follow the linting rules and update documentation where relevant.

1. Fork → 2. Feature branch → 3. Commit → 4. PR

## License

MIT — see `LICENSE`.

## Star History

<a href="https://star-history.com/#IRedDragonICY/booruprompt"><img src="https://api.star-history.com/svg?repos=IRedDragonICY/booruprompt&type=Date" alt="Star History Chart" width="600" /></a>

---

<p align="center" style="opacity:.9">
  Built by <a href="https://github.com/IRedDragonICY">IRedDragonICY</a>
  •
  Hosted on <a href="https://vercel.com">Vercel</a>
  •
  Desktop by <a href="https://tauri.app">Tauri</a>
</p>