# LGT Games Portal

A highly scalable, data-driven web games index serving a curated collection of modern HTML5 games via Cloudflare Pages.

## Overview
LGT Games Portal provides a unified layout and execution environment for standalone vanilla JavaScript games. The platform uses a dynamic routing architecture through `data/games.json` to instantly parse and render game metadata without requiring hardcoded HTML revisions.

## Directory Structure
```text
/
├── index.html              # Dynamic portal UI entry point
├── style.css               # Portal presentation layer
├── js/portal.js            # JSON parsing and DOM generation logic
├── data/games.json         # Core game registry for the portal
├── shared/                 # Global UI Injector (`layout.js`, `global.css`)
├── docs/                   # Technical documentation and game specifications
│   ├── architecture.md
│   └── games/
├── tetris/                 # Standalone game module
├── hitori/                 # Standalone game module
├── 2048/                   # Standalone game module
├── snake/                  # Standalone game module
└── minesweeper/            # Standalone game module
```

## Local Development Environment
Deploying locally is strictly recommended for resolving CORS policies during JSON fetching:
```bash
python3 -m http.server 8000
```
Navigate to `http://localhost:8000`.

## Deployment
This repository is optimized for Zero-Config deployment on Cloudflare Pages or Vercel. Push changes to the `main` branch to trigger an edge deployment.
