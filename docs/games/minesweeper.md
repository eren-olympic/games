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
