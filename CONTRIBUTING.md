# Contributing a New Game to LGT Games Portal

We welcome additions to our growing premium catalog of modern HTML5 games! Please adhere to the following standard to ensure visual continuity across the entire domain.

## Step 1: Adding the Game Directory
Place your game in a dedicated folder under the `/game/` directory. 
For example, if adding Snake: `/game/snake/index.html`

## Step 2: Injecting the Unified Layout
In your game's `index.html`, right before the closing `</body>` tag, you **must** inject the global layout script:
```html
<script src="/shared/layout.js"></script>
```
*This automatically mounts the Global Header, Footer, and styling over your game safely, allowing users to return to the portal.*

## Step 3: Registration in the System
Modify `/data/games.json` to include your new game. The central portal reads from this JSON and will dynamically construct your game card. Support for custom background gradients allows you to inject unique colors natively in JSON!

```json
{
  "id": "snake",
  "title": "Snake Classic",
  "category": "arcade",
  "desc": "The retro eating game reimagined in high definition.",
  "url": "/game/snake/",
  "bg": "radial-gradient(circle at top, #34d399 0%, #0f172a 100%)",
  "opacity": "0.9"
}
```

## Constraints
- Do not modify `/shared/global.css` or `/shared/layout.js` without approval, as this breaks cross-view standard consistency.
- Keep dependencies minimal. Vanilla JS is widely preferred over heavy build systems (like React/Vue) to maintain blazing fast performance on Cloudflare Pages.

## Game Ideas (Wishlist)
Looking for inspiration to contribute? Here are some classic games that would fit perfectly into our portal:
- **Arcade Classics**: Snake, Pac-Man, Asteroids, Breakout, Space Invaders, Pong, Flappy Bird.
- **Logic & Puzzle**: Sudoku, Minesweeper, Nonogram (Picross), Wordle Clone, Match-3.
- **Board & Strategy**: Chess, Checkers, Tic-Tac-Toe, Connect 4, Othello, Solitaire.
