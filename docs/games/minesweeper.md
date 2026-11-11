# Minesweeper Specification

## Overview
*   **Genre**: Logic
*   **Aesthetic**: Modern Neumorphism / Frosted Glass
*   **Engine**: Vanilla JS

## Core Mechanics
1. **Matrix & Evaluation Engine**: 16x16 coordinate system processing 40 randomized destructive trigger states.
2. **Fair Generation Logic**: Safe first-click execution. Random distribution sequence executes explicitly *after* coordinate capture of the inaugural click, maintaining a mathematically guaranteed 3x3 sterile safe zone.
3. **DFS Render Pipeline**: Recursive Depth-First Search array evaluation traversing adjacent 8-directional empty nodes instantly upon revelation. Reduces redundant O(N) evaluations by caching pointer status arrays internally.
4. **Input Handling**: Fully supports native DOM `click` operations along with right-click parsing via `contextmenu` overrides for rapid flagging syntax. Implements 400ms mobile `touchstart` hold overrides to permit multi-environment touch flag execution.

## Controls
Left click reveal · right click (or 400 ms long-press on touch) flag · face button new game · `T` next theme · trophy button opens records

## Themes
Four themes from the shared kit (`/shared/lgt-kit.js`): 原版 (original neumorphic look, default), 深色 (dark), 淺色 (light), 新粗獷 (neubrutalism). The records and palette buttons sit either side of the face button; `T` cycles. All board colours (covered / revealed cells, the 1–8 number colours, flags, mines, the exploded mine, wrong flags) are CSS custom properties overridden per `[data-theme]`. Stored in localStorage `lgt:minesweeper:theme`.

## Records
Time records (seconds, lower is better) via the shared kit, one table (single 16×16 / 40-mine board). Every finished game is logged once: wins with `16×16 · 40 顆地雷`, losses as 未完成 with `踩到地雷`; only wins can become the best. The best time shows under the clock, and the end card shows 用時 plus 新紀錄！ or the current 最快. Stored only in this browser (`lgt:minesweeper:records`).
