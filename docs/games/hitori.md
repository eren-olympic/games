# Hitori (嗨多林) Specification

## Overview
*   **Genre**: Logic Puzzle
*   **Aesthetic**: Zen Glassmorphism
*   **Engine**: Vanilla JS

## Core Mechanics
1. **Rule Enforcement Module**: 
    * No duplicate numbers in any given row or column.
    * Shaded cells cannot share horizontal or vertical borders.
    * Unshaded cells must mathematically remain a continuously connected grouping.
2. **State Machine**: Tri-state cellular interaction logic (Empty -> Preview -> Shaded -> Empty).
3. **Generation Engine**: Automated recursive puzzle generator ensuring valid multi-dimensional target arrays (supports 5x5, 6x6, and 8x8 variants).

## Controls
Left click cycles Empty → Preview → Shaded → Empty · right click circles a cell · `T` next theme · `Esc` closes the rules · trophy button opens records

## Themes
Four themes from the shared kit (`/shared/lgt-kit.js`): 原版 (original zen glass look, default), 深色 (dark), 淺色 (light), 新粗獷 (neubrutalism). The records and palette buttons sit right of New Game; `T` cycles. Normal, preview, shaded, circled and error cells are restyled per `[data-theme]`; a shaded cell that breaks a rule keeps its black fill with a red edge. Stored in localStorage `lgt:hitori:theme`.

## Timer & Records
An elapsed timer (left of the size picker) starts on the first move of a puzzle, pauses while the tab is hidden or the records panel is open, and stops when the board is solved. Solving is detected automatically after every move (the Check button still works); the board then locks. Time records (seconds, lower is better) via the shared kit, one table per size (5 × 5, 6 × 6, 8 × 8), detail `N×N · 塗黑 k 格`. Abandoned puzzles are not recorded. The best for the current size shows under the timer and the success message adds 用時 plus 新紀錄！ or 最快. Stored only in this browser (`lgt:hitori:records`).
