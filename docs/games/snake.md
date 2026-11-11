# Snake Specification

## Overview
*   **Genre**: Arcade
*   **Aesthetic**: Retro Cyberpunk / CRT Scanlines
*   **Engine**: Vanilla JS / CSS Grid Manipulation

## Core Mechanics
1. **Coordinate System Architecture**: Dynamic X/Y temporal displacement tracking translated directly into logical CSS Grid cell locations. Drastically truncates DOM thrashing and repaint thresholds compared to continuous HTML5 Canvas drawing.
2. **Collision Engine**: Evaluates matrix boundary violation and self-intersecting path coordinates in real-time each engine tick window.
3. **Anti-Suicide Input Filter**: Buffer filter strictly ignores rapid `< 180-degree` directional changes during single-tick windows, preventing the most common arbitrary end-state vulnerabilities found in primitive handling.

## Controls
`W A S D` / arrow keys steer · swipe on touch screens · `Space` / `Enter` restart after a crash · `T` next theme

## Themes
The palette button next to the description opens a menu: 原版 (original neon CRT look, default), 深色 (dark), 淺色 (light), 新粗獷 (neubrutalism: lavender page, white board with a thick black outline and hard shadow, flat green snake with black outlines). `T` cycles through them. The choice is saved in localStorage (`lgt:snake:theme`). The original look is the base stylesheet untouched; the other three are one token-driven ruleset (`--f-*`, `--snake-color`, `--snake-head`, `--food-color`) under `:root[data-theme=…]`. Neubrutalism loads Archivo Black from Google Fonts for the title, scores and headings.

## Records
Scores are kept by the shared kit (`/shared/lgt-kit.js`, kind `score`, higher is better) in localStorage `lgt:snake:records`: the best game plus the last 10, each with the snake length as detail. One record is written per crash. The trophy button opens the records panel; the game pauses while it is open and resumes when it closes, and the arrow keys / swipes do nothing while the panel or theme menu is open. The game-over screen shows the score and 新紀錄！ on a new best, otherwise the current best. The old `snake-best` key is read once to seed the table and is no longer written.
