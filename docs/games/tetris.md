# Tetris Specification

## Overview
*   **Genre**: Arcade / Puzzle
*   **Aesthetic**: Dark Mode Neon / Glassmorphism
*   **Engine**: Vanilla JS / DOM Manipulation

## Core Mechanics
1. **Game Matrix**: 10x20 discrete coordinate grid mapped dynamically to the active DOM.
2. **Tetrominoes (SRS)**: Standard I, J, L, O, S, T, Z pieces following rigorous Super Rotation System constraints.
3. **Advanced Gameplay Features**: 
    * Ghost Piece prediction matrix.
    * Hold Piece queue mechanism.
    * Instant Hard Drop mechanism.
4. **Input Handling (DAS/ARR)**: Custom Delayed Auto-Shift (DAS) and Auto-Repeat Rate (ARR) implemented internally to bypass standard OS keyboard operational limits. Permits competitive-grade fluidity without stalling.

## Controls
`←` `→` / `A` `D` move · `↑` / `W` rotate · `↓` / `S` soft drop · `Space` hard drop · `Shift` hold · `P` pause · `T` next theme

## Themes
The palette button at the right of the title opens a menu: 原版 (original neon glass look, default), 深色 (dark), 淺色 (light), 新粗獷 (neubrutalism: lavender page, white panels with thick black outlines and hard shadows, flat outlined blocks). `T` cycles through them. The choice is saved in localStorage (`lgt:tetris:theme`). The canvases read their block colours and drawing style from CSS custom properties (`--t1`…`--t7` in `SHAPES` order I J L O S T Z, `--t-style` original / soft / neo, `--t-hi`, `--t-edge`, `--t-grid`, `--t-ghost`) and repaint on the kit's `lgt:theme` event, so switching mid-game is immediate. Neubrutalism loads Archivo Black from Google Fonts for the title, stats and headings.

## Records
Scores are kept by the shared kit (`/shared/lgt-kit.js`, kind `score`, higher is better) in localStorage `lgt:tetris:records`: the best game plus the last 10, each with `行數 N · 等級 N` as detail. One record is written per game over (guarded, so a held key that tops out the stack can't record twice). The BEST box under LINES shows the stored best (or the live score once it passes it). The trophy button opens the records panel; a running game pauses when it opens, and gameplay keys do nothing while the panel or theme menu is open. The game-over overlay shows 新紀錄！ on a new best, otherwise the current best.

## Mobile
Under 700px wide the layout becomes the board plus one slim column (next, hold, stats); the controls list is hidden and the board canvas scales to fit, so there is no horizontal scroll at 360px. There are no touch controls yet.
