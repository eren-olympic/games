# Killer Sudoku (殺手數獨) Specification

## Overview
*   **Genre**: Logic Puzzle
*   **Aesthetic**: Dark / light theme, dashed cage outlines
*   **Engine**: Vanilla JS, single file; puzzle generation in a Web Worker

## Core Mechanics
1. **Generator**: Random solved grid → random connected cages (size weights per difficulty) → uniqueness check. Ambiguous puzzles are repaired by splitting cages, falling back to a single given only when splitting can't resolve it. Expert is usually given-free.
2. **Solver**: Constraint propagation (naked/hidden singles, cage-sum combinations, digits every cage combination requires) plus branching; used only to prove a unique solution.
3. **Notes**: `Shift`+digit writes notes in any mode, `Space` toggles note mode, multi-select (drag / Shift / ⌘) writes notes to many cells, `A` / `Shift+A` auto-candidates including cage combinations, `R` prunes impossible notes.
4. **Cage helper**: Side panel lists every digit combination for the current cage, striking out ones ruled out by placed digits. Fixed height so the layout never shifts.
5. **Session**: Progress saved to localStorage; auto-pauses when the tab or window loses focus and resumes on return (manual pauses stay paused).
