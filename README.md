# LGT Games Portal 🎮

Welcome to the **LGT Games Portal**, a highly scalable, data-driven web games index built automatically over Cloudflare Pages. This repository houses not only the central portal core logic but also a unified collection of curated, high-aesthetic HTML5 games.

## 🚀 Live Demo
Visit [lgt.wtf](https://lgt.wtf) to experience the live games portal.

## 📂 Repository Structure
```text
/
├── index.html              # Main portal layout (Data-Driven grid & search)
├── style.css               # Premium CSS for portal cards and hero section
├── js/portal.js            # Fetch logic and dynamic DOM rendering for games
├── data/games.json         # Data source containing all hosted games (Scalable)
├── shared/                 # Global UI Injector (Header & Footer) across all games
└── game/                   # Standalone game directories
    ├── tetris/
    ├── hitori/
    └── 2048/
```

## 🛠 Local Development
To test the portal locally and ensure the dynamic JSON data loads properly (preventing localhost CORS restrictions):
1. Open a terminal in the root directory: `/Users/gt/Desktop/code/lgt-games-portal`.
2. Run a simple HTTP server: `python3 -m http.server 8083` (or your preferred local server).
3. Open `http://localhost:8083` in your browser.

## 💡 Tech Stack
- Vanilla HTML, CSS, JavaScript (No heavy frameworks required)
- Lucide Icons (Search bar UI)
- Cloudflare Pages (Seamless deployment setup)
