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
