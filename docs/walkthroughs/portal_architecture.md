# Portal V2 - Scalable & Open Source

The `lgt.wtf` Games Portal has been meticulously refactored into a scalable, data-driven architecture that fully complies with standard GitHub repository guidelines.

## Completed Upgrades
- **Dynamic Render Architecture**: The portal homepage now fetches `/data/games.json` to generate game cards automatically. You can add 100+ games just by adding a block to the JSON without ever touching HTML or CSS!
- **Smart Filtering & Search**: We integrated a live search bar and active category filters (Arcade, Logic, Puzzle) so users can quickly find any game they want as your library grows.
- **URL Restructuring**: The base folder was streamlined to `/game/`, providing a cleaner and more professional URI structure matching your request (e.g., `lgt.wtf/game/tetris/`).
- **Open-Source Compliance**: The root directory now contains a professional `README.md`, strict `CONTRIBUTING.md` guidelines for future devs, a clean `.gitignore`, and a permissive MIT `LICENSE`.

## Local Testing
Your previously running server is still active and hosting the live-updated files!
**View the dynamic portal at**: [http://localhost:8083](http://localhost:8083)

## Adding a New Game is Now Seamless!
If you or an open-source contributor want to add a new game (e.g., Snake):
1. Place the game content in `/game/snake/`.
2. Add `<script src="/shared/layout.js"></script>` right before the `</body>` in the `index.html`.
3. Open `/data/games.json` and append a new JSON block summarizing the game and its CSS background gradient. The homepage will update automatically!
