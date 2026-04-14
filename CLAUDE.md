# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IssueInk is a zero-build, pure client-side blog system that uses GitHub Issues as a CMS. Blog posts are GitHub Issues fetched at runtime via the GitHub REST API and rendered as Markdown in the browser. Deployed on GitHub Pages at `blog.bemly.moe`.

## Architecture

This is a **static, no-build** project — no package.json, no bundler, no Node.js required.

- **Entry**: `index.html` loads `issueink-core/issue2vanilla.js` as an ES module
- **Config**: `config.js` — exports `ACCESS_TOKEN`, `OWNER`, `REPO`, `VerCtrl` (API version header), `SERVNAME`
- **API layer**: `issueink-core/issueApi.js` — wraps GitHub Issues REST API via Octokit (loaded from esm.sh CDN)
- **Renderer**: `issueink-core/issue2vanilla.js` — fetches issues, parses Markdown via `marked` (loaded from esm.sh CDN), renders to DOM
- **Wiki stub**: `issueink-core/wikiApi.js` — incomplete/abandoned, references unavailable jQuery-like library

**Data flow**: `config.js` → `issueApi.js` (Octokit fetches from GitHub) → `issue2vanilla.js` (marked parses Markdown → DOM)

## Dependencies

All loaded at runtime from `esm.sh` CDN (no install step):
- `octokit` — GitHub REST API client
- `marked` — Markdown parser

## How to Run

Open `index.html` in a browser (or serve statically). No build step needed.

For local development with ES modules, use any static file server:
```bash
python3 -m http.server 8000
# or
npx serve .
```

## Key Configuration

In `config.js`:
- `ACCESS_TOKEN` — GitHub PAT. Empty string = unauthenticated (60 req/hour). Set a token for 5000 req/hour.
- `OWNER` / `REPO` — target GitHub repository whose Issues become blog posts.
- NEVER commit real tokens to this file.

## API Rate Limits

- Unauthenticated: 60 requests/hour (current default, `ACCESS_TOKEN = ''`)
- Authenticated: 5000 requests/hour
- Each issue list + detail = 2 API calls. With `per_page=5`, page load uses ~10 calls.

## Conventions

- Code comments are in Chinese (casual style)
- Source files carry MPL-2.0 license headers
- JS uses ES module syntax (`import`/`export`)
- `issueApi.js` has thorough JSDoc documenting GitHub API parameters
- Sample API responses in `issueink-core/simple/` are for reference only, not loaded at runtime
