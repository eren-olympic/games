# Snake Specification

## Overview
*   **Genre**: Arcade
*   **Aesthetic**: Retro Cyberpunk / CRT Scanlines
*   **Engine**: Vanilla JS / CSS Grid Manipulation

## Core Mechanics
1. **Coordinate System Architecture**: Dynamic X/Y temporal displacement tracking translated directly into logical CSS Grid cell locations. Drastically truncates DOM thrashing and repaint thresholds compared to continuous HTML5 Canvas drawing.
2. **Collision Engine**: Evaluates matrix boundary violation and self-intersecting path coordinates in real-time each engine tick window.
3. **Anti-Suicide Input Filter**: Buffer filter strictly ignores rapid `< 180-degree` directional changes during single-tick windows, preventing the most common arbitrary end-state vulnerabilities found in primitive handling.
