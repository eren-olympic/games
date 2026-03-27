let currentSize = 8;
let puzzleData = null;
let cellStates = []; // 0 = Empty, 1 = Black, 2 = Circled

const boardEl = document.getElementById('game-board');
const statusEl = document.getElementById('status-message');

function initGame() {
    currentSize = parseInt(document.getElementById('size-select').value);
    puzzleData = HitoriGenerator.generate(currentSize);
    
    cellStates = Array.from({ length: currentSize }, () => Array(currentSize).fill(0));
    
    renderBoard();
    clearStatus();
}

function renderBoard() {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
    
    for (let r = 0; r < currentSize; r++) {
        for (let c = 0; c < currentSize; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = puzzleData.puzzle[r][c];
            cell.dataset.r = r;
            cell.dataset.c = c;
            
            cell.addEventListener('mousedown', (e) => handleCellClick(e, r, c));
            // Prevent context menu to allow smooth right-click marking
            cell.addEventListener('contextmenu', (e) => e.preventDefault()); 
            
            boardEl.appendChild(cell);
        }
    }
    updateBoardVisuals();
}

function handleCellClick(e, r, c) {
    e.preventDefault();
    clearStatus();
    
    if (e.button === 0) { // Left click
        if (cellStates[r][c] === 3) {
            cellStates[r][c] = 0; // Clear circle
        } else if (cellStates[r][c] === 0) {
            cellStates[r][c] = 1; // Preview
        } else if (cellStates[r][c] === 1) {
            cellStates[r][c] = 2; // Black
        } else if (cellStates[r][c] === 2) {
            cellStates[r][c] = 0; // Back to empty
        }
    } 
    else if (e.button === 2) { // Right click
        if (cellStates[r][c] === 3) cellStates[r][c] = 0;
        else cellStates[r][c] = 3;
    }
    
    updateBoardVisuals();
}

function updateBoardVisuals() {
    const cells = boardEl.children;
    for (let r = 0; r < currentSize; r++) {
        for (let c = 0; c < currentSize; c++) {
            const idx = r * currentSize + c;
            const state = cellStates[r][c];
            const cell = cells[idx];
            
            cell.classList.remove('preview', 'shaded', 'circled', 'error');
            
            if (state === 1) cell.classList.add('preview');
            else if (state === 2) cell.classList.add('shaded');
            else if (state === 3) cell.classList.add('circled');
        }
    }
}

function checkSolution() {
    let isValid = true;
    let errors = [];
    
    clearStatus();
    
    let blackCells = Array.from({ length: currentSize }, () => Array(currentSize).fill(false));
    for(let r=0; r<currentSize; r++) {
        for(let c=0; c<currentSize; c++) {
            if(cellStates[r][c] === 2) blackCells[r][c] = true;
        }
    }
    
    // 1. Check Adjacency
    for(let r=0; r<currentSize; r++) {
        for(let c=0; c<currentSize; c++) {
            if (blackCells[r][c]) {
                if (r > 0 && blackCells[r-1][c]) { isValid = false; errors.push([r,c]); errors.push([r-1,c]); }
                if (r < currentSize-1 && blackCells[r+1][c]) { isValid = false; errors.push([r,c]); errors.push([r+1,c]); }
                if (c > 0 && blackCells[r][c-1]) { isValid = false; errors.push([r,c]); errors.push([r,c-1]); }
                if (c < currentSize-1 && blackCells[r][c+1]) { isValid = false; errors.push([r,c]); errors.push([r,c+1]); }
            }
        }
    }
    
    // 2. Check Connectivity
    if (!HitoriGenerator.isConnected(blackCells, currentSize)) {
        isValid = false;
        showStatus("Unshaded cells must be visually connected!", false);
    }
    
    // 3. Check Duplicates in Rows and Cols
    for (let i = 0; i < currentSize; i++) {
        let rowSeen = {};
        let colSeen = {};
        
        for (let j = 0; j < currentSize; j++) {
            if (!blackCells[i][j]) {
                let val = puzzleData.puzzle[i][j];
                if (rowSeen[val] !== undefined) {
                    isValid = false;
                    errors.push([i, j]);
                    errors.push([i, rowSeen[val]]);
                } else {
                    rowSeen[val] = j;
                }
            }
            
            if (!blackCells[j][i]) {
                let val = puzzleData.puzzle[j][i];
                if (colSeen[val] !== undefined) {
                    isValid = false;
                    errors.push([j, i]);
                    errors.push([colSeen[val], i]);
                } else {
                    colSeen[val] = j;
                }
            }
        }
    }
    
    if (errors.length > 0) {
        const cells = boardEl.children;
        errors.forEach(([r, c]) => {
            cells[r * currentSize + c].classList.add('error');
        });
        if (statusEl.className.includes('hidden')) {
            showStatus("There are duplicate numbers or touching black cells (highlighted in red).", false);
        }
    } else if (isValid) {
        showStatus("Congratulations! You solved it! 🎉", true);
    }
}

function showStatus(msg, isSuccess) {
    statusEl.textContent = msg;
    statusEl.className = 'status ' + (isSuccess ? 'success' : 'fail');
}

function clearStatus() {
    statusEl.className = 'status hidden';
    const cells = boardEl.children;
    for(let i=0; i<cells.length; i++) {
        cells[i].classList.remove('error');
    }
}

document.getElementById('new-game-btn').addEventListener('click', initGame);
document.getElementById('size-select').addEventListener('change', initGame);
document.getElementById('check-btn').addEventListener('click', checkSolution);

const modal = document.getElementById('rules-modal');
document.getElementById('hint-btn').addEventListener('click', () => { modal.classList.remove('hidden'); });
document.getElementById('close-rules-btn').addEventListener('click', () => { modal.classList.add('hidden'); });

initGame();
