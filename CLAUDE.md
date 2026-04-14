# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IssueInk is a client-side blog system that uses GitHub Issues as CMS. Written in ReScript, compiled to ES modules, bundled with esbuild, and deployed on GitHub Pages at `blog.bemly.moe`.

## Build Commands

```bash
npm install              # Install dependencies
npm run build            # Full build: rescript compile + esbuild bundle
npm run res:build        # ReScript compile only (.res -> .mjs)
npm run bundle           # esbuild bundle only (src/*.mjs -> dist/bundle.js)
npm run dev              # ReScript watch mode
npm run clean            # Clean build artifacts
```

The full build pipeline: `rescript build` compiles `src/*.res` to `src/*.mjs`, then `esbuild` bundles `src/App.mjs` (+ @rescript/runtime) into `dist/bundle.js`. The `marked` library is external (loaded via importmap from esm.sh CDN).

## Architecture

- **Language**: ReScript 12.x with @rescript/core
- **Bundler**: esbuild (bundles @rescript/runtime into dist/bundle.js)
- **Dependencies**: `marked` loaded at runtime via `<script type="importmap">` pointing to esm.sh CDN
- **Routing**: URL hash-based (`#/`, `#/post/123`, `#/labels/name`)
- **API**: Raw `fetch` against GitHub REST API v3 (no Octokit — simpler binding)

### Source files (`src/`)

| File | Role |
|------|------|
| `Config.res` | Blog config (owner, repo, token, perPage) |
| `GithubApi.res` | GitHub REST API: types + fetch-based calls (getIssues, getIssue, getComments, getLabels) |
| `Marked.res` | Binding to `marked.parse` |
| `DomHelpers.res` | DOM externals (createElement, appendChild, setInnerHTML, etc.) |
| `Router.res` | Hash-based route parsing and navigation |
| `App.res` | Entry point — wires router to page renderers, creates layout |
| `PostList.res` | Post list page with cards, search filter, pagination |
| `PostDetail.res` | Single post view with markdown rendering + comments |
| `Sidebar.res` | Sidebar: about, search input, labels, links |
| `Pagination.res` | Prev/next pagination controls |

### Key patterns

- Use `string ++ string` for concatenation, not template literals (ReScript `` ` `` syntax differs from JS)
- `%raw(...)` for JS interop where no binding exists — note that ReScript variable names may be renamed in output
- `async/await` for promise handling (ReScript 12 built-in)
- `@get`/`@set`/`@send`/`@val` externals for DOM and Web API bindings
- Filter out GitHub pull requests: `issue.pull_request` field present = PR, skip it

## Configuration

`src/Config.res`:
- `accessToken` — GitHub PAT. Empty = unauthenticated (60 req/hr). Set token for 5000 req/hr.
- `owner` / `repo` — target GitHub repository

## Old Code

`config.js`, `issueink-core/` are the original vanilla JS implementation, kept for reference. Not loaded by the app.
