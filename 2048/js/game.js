const SIZE = 4;
let grid = []; 
let tiles = []; 
let tileIdCounter = 0;

let score = 0;
let bestScore = localStorage.getItem('2048-best-score') || 0;
let isGameOver = false;
let isGameWon = false;
let hasWonBefore = false;
let keepPlaying = false;

// DOM
const tileContainer = document.getElementById('tile-container');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const msgEl = document.getElementById('game-message');
const msgText = document.getElementById('msg-text');

// Initialize grid-bg
const gridBg = document.getElementById('grid-bg');
for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    gridBg.appendChild(cell);
}

function initGame() {
    grid = Array.from({length: SIZE}, () => Array(SIZE).fill(null));
    tiles = [];
    tileContainer.innerHTML = '';
    score = 0;
    isGameOver = false;
    isGameWon = false;
    hasWonBefore = false;
    keepPlaying = false;
    
    msgEl.classList.add('hidden');
    document.getElementById('keep-playing-btn').classList.add('hidden');
    
    updateScore();
    bestScoreEl.textContent = bestScore;
    
    addRandomTile();
    addRandomTile();
    render();
}

function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (!grid[r][c]) emptyCells.push({r, c});
        }
    }
    if (emptyCells.length === 0) return;
    
    const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const val = Math.random() < 0.9 ? 2 : 4;
    const tile = { id: tileIdCounter++, r, c, val, isNew: true, isMerged: false };
    grid[r][c] = tile;
    tiles.push(tile);
}

function render() {
    tiles.forEach(tile => {
        if (!tile.el) {
            tile.el = document.createElement('div');
            tile.el.className = `tile tile-${tile.val > 2048 ? 'super' : tile.val}`;
            const inner = document.createElement('div');
            inner.className = 'tile-inner';
            inner.textContent = tile.val;
            tile.el.appendChild(inner);
            tileContainer.appendChild(tile.el);
        }
        
        tile.el.style.transform = `translate(calc(${tile.c} * (var(--cell-size) + var(--gap-size))), calc(${tile.r} * (var(--cell-size) + var(--gap-size))))`;
        
        if (tile.isMerged) {
            tile.el.classList.add('merged');
            setTimeout(() => tile.el.classList.remove('merged'), 200);
            tile.isMerged = false;
        }
    });

    const toRemove = tiles.filter(t => t.markedForDeletion);
    toRemove.forEach(t => {
        setTimeout(() => {
            if (t.el && t.el.parentElement) {
                t.el.parentElement.removeChild(t.el);
            }
        }, 150); 
    });
    tiles = tiles.filter(t => !t.markedForDeletion);
}

function updateScore() {
    scoreEl.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('2048-best-score', bestScore);
        bestScoreEl.textContent = bestScore;
    }
}

function move(direction) {
    if (isGameOver || (isGameWon && !keepPlaying)) return;

    let hasMoved = false;
    let newScore = 0;
    
    tiles.forEach(t => t.isNew = false);
    
    const vector = getVector(direction);
    const traversals = buildTraversals(vector);

    traversals.x.forEach(c => {
        traversals.y.forEach(r => {
            const tile = grid[r][c];
            if (tile) {
                const positions = findFarthestPosition({r, c}, vector);
                const next = grid[positions.next.r]?.[positions.next.c];
                
                if (next && next.val === tile.val && !next.mergedThisTurn) {
                    // Merge
                    const mergedVal = tile.val * 2;
                    newScore += mergedVal;
                    
                    const newTile = { id: tileIdCounter++, r: next.r, c: next.c, val: mergedVal, isNew: false, isMerged: true, mergedThisTurn: true };
                    
                    grid[r][c] = null;
                    grid[next.r][next.c] = newTile;
                    
                    tile.markedForDeletion = true;
                    tile.r = next.r;
                    tile.c = next.c;
                    next.markedForDeletion = true;
                    
                    tiles.push(newTile);
                    hasMoved = true;
                    if (mergedVal === 2048 && !hasWonBefore) {
                        isGameWon = true;
                        hasWonBefore = true;
                    }
                } else if (positions.farthest.r !== r || positions.farthest.c !== c) {
                    // Move
                    grid[positions.farthest.r][positions.farthest.c] = tile;
                    grid[r][c] = null;
                    tile.r = positions.farthest.r;
                    tile.c = positions.farthest.c;
                    hasMoved = true;
                }
            }
        });
    });

    if (hasMoved) {
        score += newScore;
        updateScore();
        
        tiles.forEach(t => { if(t.mergedThisTurn) delete t.mergedThisTurn; });
        
        addRandomTile();
        render();
        
        if (!movesAvailable()) {
            isGameOver = true;
            showMsg("Game Over!", false);
        } else if (isGameWon && !keepPlaying) {
            showMsg("You Win!", true);
        }
    }
}

function getVector(direction) {
    const map = {
        0: { r: -1, c: 0 }, // Up
        1: { r: 0, c: 1 },  // Right
        2: { r: 1, c: 0 },  // Down
        3: { r: 0, c: -1 }  // Left
    };
    return map[direction];
}

function buildTraversals(vector) {
    const traversals = { x: [], y: [] };
    for (let pos = 0; pos < SIZE; pos++) {
        traversals.x.push(pos);
        traversals.y.push(pos);
    }
    if (vector.c === 1) traversals.x.reverse();
    if (vector.r === 1) traversals.y.reverse();
    return traversals;
}

function findFarthestPosition(cell, vector) {
    let previous;
    do {
        previous = cell;
        cell = { r: previous.r + vector.r, c: previous.c + vector.c };
    } while (withinBounds(cell) && !grid[cell.r][cell.c]);
    
    return {
        farthest: previous,
        next: cell
    };
}

function withinBounds(pos) {
    return pos.r >= 0 && pos.r < SIZE && pos.c >= 0 && pos.c < SIZE;
}

function movesAvailable() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (!grid[r][c]) return true;
            if (r < SIZE - 1 && grid[r][c].val === grid[r+1][c].val) return true;
            if (c < SIZE - 1 && grid[r][c].val === grid[r][c+1].val) return true;
        }
    }
    return false;
}

function showMsg(msg, isWon) {
    msgText.textContent = msg;
    msgEl.classList.remove('hidden');
    if (isWon) {
        document.getElementById('keep-playing-btn').classList.remove('hidden');
        document.getElementById('retry-btn').textContent = 'Restart';
    } else {
        document.getElementById('keep-playing-btn').classList.add('hidden');
        document.getElementById('retry-btn').textContent = 'Try again';
    }
}

document.addEventListener('keydown', (e) => {
    const map = {
        'ArrowUp': 0, 'KeyW': 0,
        'ArrowRight': 1, 'KeyD': 1,
        'ArrowDown': 2, 'KeyS': 2,
        'ArrowLeft': 3, 'KeyA': 3
    };
    if (map[e.code] !== undefined) {
        e.preventDefault();
        move(map[e.code]);
    }
});

let touchStart = null;
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) return;
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, {passive: false});

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, {passive: false});

document.addEventListener('touchend', (e) => {
    if (!touchStart || e.changedTouches.length === 0) return;
    
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    if (Math.max(absDx, absDy) > 30) {
        if (absDx > absDy) {
            move(dx > 0 ? 1 : 3);
        } else {
            move(dy > 0 ? 2 : 0);
        }
    }
    touchStart = null;
});

document.getElementById('restart-btn').addEventListener('click', initGame);
document.getElementById('retry-btn').addEventListener('click', initGame);
document.getElementById('keep-playing-btn').addEventListener('click', () => {
    msgEl.classList.add('hidden');
    keepPlaying = true;
});

initGame();
