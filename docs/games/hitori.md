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
