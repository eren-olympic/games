# Killer Sudoku (殺手數獨) Specification

## Overview
*   **Genre**: Logic Puzzle
*   **Aesthetic**: Dark / light / neubrutalism themes, dashed cage outlines
*   **Engine**: Vanilla JS, single file; puzzle generation in a Web Worker

## Core Mechanics
1. **Generator**: Random solved grid → random connected cages (size weights per difficulty) → uniqueness check. Ambiguous puzzles are repaired by splitting cages, falling back to a single given only when splitting can't resolve it. Expert is usually given-free.
2. **Solver**: Constraint propagation (naked/hidden singles, cage-sum combinations, digits every cage combination requires) plus branching; used only to prove a unique solution.
3. **Notes**: `Shift`+digit writes notes in any mode, `Space` toggles note mode, multi-select (drag / Shift / ⌘) writes notes to many cells, `A` / `Shift+A` auto-candidates including cage combinations, `R` prunes impossible notes.
4. **Cage helper**: Side panel lists every digit combination for the current cage, striking out ones ruled out by placed digits. Fixed height so the layout never shifts.
5. **Session**: Progress saved to localStorage; auto-pauses when the tab or window loses focus and resumes on return (manual pauses stay paused).

## Themes
Uses the shared kit (`/shared/lgt-kit.js`): palette button in the header (or `T`) cycles 深色 (default) / 淺色 / 新粗獷. Stored in `lgt:killer-sudoku:theme`; the old `opts.theme` dark/light choice is migrated once. 新粗獷 is lavender page, white bordered panels with hard offset shadows, Archivo Black digits, yellow selection and buttons, thick black 3×3 box lines and black dashed cages.

## Records
Local only (`lgt:killer-sudoku:records`), one table per difficulty (簡單 / 中等 / 困難 / 專家), fastest solve time wins. A record is added once when a puzzle is solved, with mistakes and hints used as detail (`錯誤 1 · 提示 2 次`); abandoned puzzles are not recorded, and a solved save is never restored, so reloading can't record twice. The header shows the current difficulty's 最快 time, the win card says 新紀錄！ on a new best, and the trophy opens the panel on the current difficulty. The timer pauses while the panel is open (a manual pause stays paused), and game keys are ignored while it or the theme menu is open.
