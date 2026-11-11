# Make Ten (湊十) Specification

## Overview
*   **Genre**: Timed arithmetic puzzle
*   **Aesthetic**: Three themes (dark, light, neubrutalism: thick black outlines, hard offset shadows, flat saturated colours), per-digit colour tints on rounded tiles
*   **Engine**: Vanilla JS, single file, DOM grid

## Core Mechanics
1. **Board**: 17 × 10 digits 1–9, full at start. The total is nudged to a multiple of 10 so a full clear is possible on paper.
2. **Move**: Drag a rectangle; a tile counts as inside when the box covers its centre. If the selected digits sum to exactly 10, they clear. Cleared cells are empty, count as 0, and are never refilled, so late-game boxes can span gaps.
3. **Feedback**: While dragging, the running sum follows the pointer; the box turns green at 10 and red above 10. Wrong sums cost nothing.
4. **Scoring**: 1 point per tile cleared, 170 max.
5. **End**: 120 seconds run out, the board is cleared, or no rectangle sums to 10 any more (checked after each clear with 2-D prefix sums).
6. **Session**: The board is blurred before start and while paused; the game auto-pauses when the tab or window loses focus. Best score and theme are kept in localStorage.
7. **Mobile**: On portrait screens under 760px the board is transposed to 10 × 17; the rule is unaffected because rectangles stay rectangles.

## Controls
`Enter` / `Space` start or replay · `P` / `Esc` pause · `R` new board · `T` next theme · trophy button opens records

## Themes
Three themes from the shared kit (`/shared/lgt-kit.js`): 深色 (dark, default), 淺色 (light), 新粗獷 (neubrutalism). The palette button in the header opens the menu; `T` cycles. Stored per game in localStorage `lgt:<game>:theme`.

## Records
Score records via the shared kit: best score plus the last 10 games with date and tiles cleared, opened from the trophy button (the game pauses while it is open). Stored only in this browser (`lgt:<game>:records`). The best score from v1.0–1.1 (`<game>-opts.best`) is carried over once.
