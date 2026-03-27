# 2048 Vibrant Edition Completed!

The classic 2048 game has been implemented with a gorgeous, modern "Vibrant Gradient" and Neumorphism aesthetic. 

## Features Delivered
- **Core Gameplay Loop**: Slide tiles (Up, Down, Left, Right) to merge identical numbers. The game keeps track of your current score and smartly saves your Best Score to your browser's local storage so you don't lose it on refresh!
- **Silky Smooth Animations**: 
  - Tiles slide across the board using optimized CSS 2D Transforms (`translate`).
  - New tiles organically pop into existence (`scale` appear animation).
  - Merged tiles give a satisfying bounce (`scale` pop animation) exactly at the point of impact.
- **Premium Aesthetics**: Each tile value has a bespoke, carefully handpicked gradient ranging from calming creams (2, 4) to warm oranges (8, 16, 32), all the way up to fiery reds and premium gold (1024, 2048).
- **Responsive Controls**: Fully supports `Arrow Keys` and `W A S D` on the keyboard. Also features native Touch Swiping for mobile devices with overscroll prevention so the screen doesn't bounce around as you play.
- **Game States**: Includes transparent glassmorphic overlays for "Game Over" and a "You Win!" state (with the option to 'Keep going' past 2048).

## How to Play
A background server has been launched for you on port 8082.
**Open your browser to**: [http://localhost:8082](http://localhost:8082)

1. Use your **Arrow Keys** or **WASD** to shift the board.
2. Two identical numbers will merge into one when they touch.
3. Your goal is to keep playing until you reach **2048**. (Or even higher!)
4. If the board fills up and no more merges are possible, it's Game Over.
