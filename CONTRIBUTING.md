# Contribution Guidelines

We actively welcome pull requests. Please rigorously adhere to these internal structural guidelines before submitting your proposal to ensure architectural continuity across instances.

## Standard Requirements for New Games
1. **Environment**: All algorithmic and state logic must reside purely in Vanilla JavaScript (ES6+). Do not bundle React, Vue, or heavy transpilation layers to preserve Cloudflare Pages efficiency.
2. **Location**: Create your module bundle cleanly inside `/game/{game_id}/` (this keeps the repo organized, the `build.sh` script will automatically flatten it to the root during deployment).
3. **Global Injector Component**: You must cleanly inject the unified framing component before the closing `</body>` tag of your application interface:
   ```html
   <script src="/shared/layout.js"></script>
   ```
4. **Registry**: Append your game object metadata explicitly to `/data/games.json`. Refrain from formatting errors to prevent asynchronous UI breakage during Fetch operations.

## Example Object
```json
{
  "id": "snake",
  "title": "Snake Classic",
  "category": "arcade",
  "desc": "The retro eating game reimagined in high definition.",
  "url": "/snake/",
  "bg": "radial-gradient(circle at top, #34d399 0%, #0f172a 100%)",
  "opacity": "0.9"
}
```

## Proposed Additions (Roadmap)
*   **Arcade**: Snake (Completed), Pac-Man, Asteroids, Breakout.
*   **Logic**: Sudoku, Minesweeper, Wordle.
*   **Strategy**: Chess, Tic-Tac-Toe, Othello.
