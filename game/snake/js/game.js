const GRID_SIZE = 20;
const board = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const msgEl = document.getElementById('game-message');
const msgText = document.getElementById('msg-text');
const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');

let snake = [];
let food = {};
let direction = { x: 0, y: -1 };  // Up
let nextDirection = { x: 0, y: -1 }; 
let score = 0;
let bestScore = localStorage.getItem('snake-best') || 0;
let gameInterval;
const SPEED = 130; 
let isGameOver = true;

bestScoreEl.textContent = bestScore;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    direction = { x: 0, y: -1 };
    nextDirection = { x: 0, y: -1 };
    score = 0;
    updateScore();
    isGameOver = false;
    msgEl.classList.add('hidden');
    startBtn.classList.add('hidden');
    retryBtn.classList.add('hidden');
    
    generateFood();
    board.innerHTML = '';
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, SPEED);
}

function gameLoop() {
    update();
    draw();
}

function update() {
    direction = nextDirection;
    
    const head = { 
        x: snake[0].x + direction.x, 
        y: snake[0].y + direction.y 
    };
    
    if (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE) {
        return gameOver();
    }
    
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return gameOver();
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        generateFood();
    } else {
        snake.pop(); 
    }
}

function draw() {
    board.innerHTML = '';
    
    snake.forEach((segment, index) => {
        const snakeElem = document.createElement('div');
        snakeElem.style.gridColumn = segment.x;
        snakeElem.style.gridRow = segment.y;
        snakeElem.classList.add('snake-part');
        if (index === 0) {
            snakeElem.classList.add('snake-head');
        }
        board.appendChild(snakeElem);
    });
    
    const foodElem = document.createElement('div');
    foodElem.style.gridColumn = food.x;
    foodElem.style.gridRow = food.y;
    foodElem.classList.add('food');
    board.appendChild(foodElem);
}

function generateFood() {
    let newFoodPosition;
    let onSnake;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * GRID_SIZE) + 1,
            y: Math.floor(Math.random() * GRID_SIZE) + 1
        };
        onSnake = snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y);
    } while (onSnake);
    
    food = newFoodPosition;
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    msgText.textContent = "SYSTEM CRASH";
    msgText.style.color = "var(--food-color)";
    msgEl.classList.remove('hidden');
    retryBtn.classList.remove('hidden');
}

function updateScore() {
    scoreEl.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('snake-best', bestScore);
        bestScoreEl.textContent = bestScore;
    }
}

document.addEventListener('keydown', e => {
    if (isGameOver) {
        if (e.code === 'Space' || e.code === 'Enter') initGame();
        return;
    }
    
    switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
        case 'KeyS':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
        case 'KeyA':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
        case 'KeyD':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            break;
    }
});

let touchStart = null;
document.addEventListener('touchstart', e => {
    if (e.touches.length > 1) return;
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, {passive: false});

document.addEventListener('touchmove', e => {
    if (!isGameOver) e.preventDefault(); 
}, {passive: false});

document.addEventListener('touchend', e => {
    if (!touchStart || isGameOver) return;
    
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
            if (dx > 0 && direction.x !== -1) nextDirection = { x: 1, y: 0 };
            else if (dx < 0 && direction.x !== 1) nextDirection = { x: -1, y: 0 };
        } else {
            if (dy > 0 && direction.y !== -1) nextDirection = { x: 0, y: 1 };
            else if (dy < 0 && direction.y !== 1) nextDirection = { x: 0, y: -1 };
        }
    }
    touchStart = null;
});

startBtn.addEventListener('click', initGame);
retryBtn.addEventListener('click', initGame);
