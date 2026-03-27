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
