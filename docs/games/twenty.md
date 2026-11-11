# Twenty Specification

## Overview
*   **Genre**: Action Puzzle
*   **Aesthetic**: Flat / Pop Colors
*   **Engine**: Vanilla JS Grid Engine + Drag & Drop

## Core Mechanics
1. **Grid-based Gravity Engine**: The game uses an abstraction of 5 array stacks to simulate gravity. CSS `bottom` transition effortlessly animates DOM blocks dropping when array indices are adjusted manually or sequentially processed.
2. **Merge Mechanics**: Blocks dragged and released over an arbitrary designated column will automatically snap to the topmost position of that stack.
    * If `dragged_tile.val === current_top_tile.val`, the two identical blocks pop out of the DOM matrix and a new $n+1$ value element is dynamically constructed and injected.
    * This process operates recursively. Triggering a merge will continually evaluate downward settling gravity collapses.
3. **Danger Engine**: An invisible `requestAnimationFrame` loop drives a visible timeline bar. When reaching 10 seconds, `pushRow()` instantly generates a randomized bottom row of logic, unshifting new items beneath entirely existing structures.
4. **End Game**: Loss status forces an overlay stop-screen if structural height bounds ($>8$ units) are violated.

## Controls
Drag a block (mouse or touch) and drop it on a column · `T` next theme.

## Themes
The palette button under the title opens a menu: 原版 (original, default: slate board, rainbow blocks, Outfit), 深色 (dark), 淺色 (light), 新粗獷 (neubrutalism: lavender page, thick black outlines, hard offset shadows, flat saturated blocks, Archivo Black numerals). The choice is saved in localStorage (`lgt:twenty:theme`). Block colours are CSS classes `.tile.v1` … `.tile.v20` reading `--c1` … `--c20` (and `--f1` … `--f20` for the number colour), redefined per theme, so switching mid-game repaints every block.

## Records
The trophy button opens the records panel (best plus the last 10 games, stored only in this browser under `lgt:twenty:records`). The score is the highest block reached; each finished game (OVERLOAD) is recorded once with the time survived and the number of merges (`撐了 2:05 · 合併 12 次`). The BEST pill shows the recorded best; the game-over screen shows 新紀錄！ or the best. The row timer pauses while the records panel is open.
