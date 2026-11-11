# Cross Pop (十字消) Specification

## Overview
*   **Genre**: Timed visual-matching puzzle
*   **Aesthetic**: Three themes (dark, light, neubrutalism: thick black outlines, hard offset shadows, flat saturated colours), ten tile colours, optional shape glyphs for colour-blind play
*   **Engine**: Vanilla JS, single file, DOM grid

## Core Mechanics
1. **Board**: 23 × 15 cells holding 200 tiles, exactly 20 in each of 10 colours, scattered at random; the other 145 cells are empty.
2. **Move**: Press an empty cell and release on the same cell (sliding off before release cancels). The move fires on release, not on press. From it, the nearest tile up, down, left and right is found (skipping empty cells). Every colour that appears two or more times among those (up to four) tiles is cleared, so two pairs clear together.
3. **Miss**: A tap that clears nothing costs 10 seconds. Tapping a tile does nothing.
4. **Feedback**: Rays in the tile's colour run from the tapped cell to each cleared tile; misses flash the cell and the time bar.
5. **Scoring**: 1 point per tile, 200 max.
6. **End**: Time runs out, all 200 tiles are cleared, or no empty cell would clear anything.
7. **Session / mobile**: Same as Make Ten: blurred board before start and while paused, auto-pause on focus loss, best score / theme / colour-blind mode in localStorage, transposed board on portrait phones.

## Controls
`Enter` / `Space` start or replay · `P` / `Esc` pause · `R` new board · `T` next theme · `C` colour-blind glyphs

## Themes
The palette button in the header opens a menu: 深色 (dark, default), 淺色 (light), 新粗獷 (neubrutalism). The choice is saved in localStorage. Neubrutalism loads Archivo Black from Google Fonts for numerals and headings.
