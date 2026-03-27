const ROWS = 16;
const COLS = 16;
const MINES = 40;

let grid = [];
let isFirstClick = true;
let isGameOver = false;
let minesLeft = MINES;
let timer = 0;
let timerInterval = null;

const gridEl = document.getElementById('grid');
const mineCountEl = document.getElementById('mine-count');
const timerEl = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const statusIcon = document.getElementById('status-icon');
const overlay = document.getElementById('game-over-overlay');
const overlayText = document.getElementById('overlay-text');

function initGame() {
    isFirstClick = true;
    isGameOver = false;
    minesLeft = MINES;
    timer = 0;
    
    clearInterval(timerInterval);
    timerEl.textContent = '000';
    
    overlay.classList.add('hidden');
    setStatusIcon('smile');
    
    grid = Array.from({length: ROWS}, (_, r) => 
        Array.from({length: COLS}, (_, c) => ({
            r, c, 
            isMine: false, 
            isRevealed: false, 
            isFlagged: false, 
            neighborMines: 0,
            el: null
        }))
    );
    
    updateMineCount();
    renderGrid();
}

function setStatusIcon(iconName) {
    statusIcon.setAttribute('data-lucide', iconName);
    if (window.lucide) lucide.createIcons();
}

function renderGrid() {
    gridEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cellData = grid[r][c];
            const cellEl = document.createElement('div');
            cellEl.className = 'cell';
            
            cellEl.addEventListener('click', () => handleLeftClick(r, c));
            cellEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(r, c);
            });
            
            let longPressTimer;
            cellEl.addEventListener('touchstart', (e) => {
                if(e.touches.length > 1) return;
                longPressTimer = setTimeout(() => {
                    handleRightClick(r, c);
                }, 400); 
            }, {passive: true});
            cellEl.addEventListener('touchend', () => clearTimeout(longPressTimer));
            cellEl.addEventListener('touchmove', () => clearTimeout(longPressTimer));
            
            cellData.el = cellEl;
            gridEl.appendChild(cellEl);
        }
    }
}

function placeMines(firstR, firstC) {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);
        
        if (!grid[r][c].isMine) {
            // Safety zone: 3x3 around first click
            if (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1) continue;
            
            grid[r][c].isMine = true;
            minesPlaced++;
        }
    }
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!grid[r][c].isMine) {
                let count = 0;
                getNeighbors(r, c).forEach(n => {
                    if (n.isMine) count++;
                });
                grid[r][c].neighborMines = count;
            }
        }
    }
}

function getNeighbors(r, c) {
    const neighbors = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const nr = r + i;
            const nc = c + j;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                neighbors.push(grid[nr][nc]);
            }
        }
    }
    return neighbors;
}

function handleLeftClick(r, c) {
    if (isGameOver || grid[r][c].isFlagged || grid[r][c].isRevealed) return;
    
    if (isFirstClick) {
        isFirstClick = false;
        placeMines(r, c);
        timerInterval = setInterval(() => {
            if (timer < 999) timer++;
            timerEl.textContent = timer.toString().padStart(3, '0');
        }, 1000);
    }
    
    revealCell(r, c);
    checkWinCondition();
}

function handleRightClick(r, c) {
    if (isGameOver || grid[r][c].isRevealed) return;
    
    const cell = grid[r][c];
    cell.isFlagged = !cell.isFlagged;
    
    if (cell.isFlagged) {
        cell.el.innerHTML = '<i data-lucide="flag" style="width:18px;height:18px;"></i>';
        cell.el.classList.add('flagged');
        minesLeft--;
    } else {
        cell.el.innerHTML = '';
        cell.el.classList.remove('flagged');
        minesLeft++;
    }
    
    if (window.lucide) lucide.createIcons();
    updateMineCount();
}

function revealCell(r, c) {
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;
    
    cell.isRevealed = true;
    cell.el.classList.add('revealed');
    
    if (cell.isMine) {
        cell.el.classList.add('mine');
        cell.el.innerHTML = '<i data-lucide="skull" style="width:20px;height:20px;"></i>';
        endGame(false);
        return;
    }
    
    if (cell.neighborMines > 0) {
        cell.el.textContent = cell.neighborMines;
        cell.el.classList.add(`n${cell.neighborMines}`);
    } else {
        getNeighbors(r, c).forEach(n => {
            if (!n.isRevealed && !n.isFlagged) {
                revealCell(n.r, n.c);
            }
        });
    }
}

function updateMineCount() {
    mineCountEl.textContent = minesLeft.toString().padStart(3, '0');
}

function checkWinCondition() {
    let unrevealedCount = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!grid[r][c].isRevealed) {
                unrevealedCount++;
            }
        }
    }
    
    if (unrevealedCount === MINES && !isGameOver) {
        endGame(true);
    }
}

function endGame(isWin) {
    if (isGameOver) return;
    isGameOver = true;
    clearInterval(timerInterval);
    
    if (isWin) {
        setStatusIcon('sunglasses');
        overlayText.textContent = "YOU WIN!";
        overlayText.style.color = "#22c55e"; 
        
        grid.forEach(row => row.forEach(cell => {
            if(cell.isMine && !cell.isFlagged) {
                handleRightClick(cell.r, cell.c); 
            }
        }));
    } else {
        setStatusIcon('frown');
        overlayText.textContent = "GAME OVER";
        overlayText.style.color = "#ef4444"; 
        
        // Reveal all mines and incorrect flags
        grid.forEach(row => row.forEach(cell => {
            if (cell.isMine && !cell.isFlagged && !cell.isRevealed) {
                cell.el.classList.add('revealed', 'mine');
                cell.el.innerHTML = '<i data-lucide="bomb" style="width:20px;height:20px;"></i>';
            } else if (!cell.isMine && cell.isFlagged) {
                cell.el.classList.add('revealed');
                cell.el.innerHTML = '<i data-lucide="x" style="width:20px;height:20px;color:#ef4444;"></i>';
            }
        }));
    }
    
    overlay.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
}

resetBtn.addEventListener('click', initGame);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
