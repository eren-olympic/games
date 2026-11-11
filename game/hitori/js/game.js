let currentSize = 8;
let puzzleData = null;
let cellStates = []; // 0 = Empty, 1 = Black, 2 = Circled

const boardEl = document.getElementById('game-board');
const statusEl = document.getElementById('status-message');
const hudTimeEl = document.getElementById('hud-time');
const hudBestEl = document.getElementById('hud-best');

// ---- elapsed timer: starts on the first move, stops on solve, pauses while the tab is hidden ----
let solved = false;
let elapsedMs = 0;      // banked time
let runStart = null;    // performance.now() of the running segment, null when stopped
let started = false;
let tickId = null;

function elapsedSec() {
    return (elapsedMs + (runStart == null ? 0 : performance.now() - runStart)) / 1000;
}
function fmtTime(sec) {
    const s = Math.floor(sec), m = Math.floor(s / 60);
    return m + ':' + String(s % 60).padStart(2, '0');
}
function renderTime() { hudTimeEl.textContent = fmtTime(elapsedSec()); }
function timerRun() {
    if (runStart != null || !started || solved || document.hidden) return;
    runStart = performance.now();
    tickId = setInterval(renderTime, 250);
}
function timerPause() {
    if (runStart == null) return;
    elapsedMs += performance.now() - runStart;
    runStart = null;
    clearInterval(tickId);
    renderTime();
}
function timerReset() {
    timerPause();
    elapsedMs = 0; started = false;
    renderTime();
}
document.addEventListener('visibilitychange', () => { if (document.hidden) timerPause(); else timerRun(); });

function variantId() { return String(currentSize); }
function updateBest() {
    const b = window.LGT ? LGT.best(variantId()) : null;
    hudBestEl.textContent = b == null ? '—' : LGT.format(b);
    hudBestEl.classList.remove('hud-rec');
}

function initGame() {
    currentSize = parseInt(document.getElementById('size-select').value);
    puzzleData = HitoriGenerator.generate(currentSize);
    
    cellStates = Array.from({ length: currentSize }, () => Array(currentSize).fill(0));
    
    solved = false;
    timerReset();
    updateBest();
    boardEl.classList.remove('solved');
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
    if (solved) return;
    clearStatus();
    if (!started) { started = true; timerRun(); }
    
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
    if (isSolvedState()) onSolved();
}

// Silent rule check (same rules as checkSolution): no touching blacks, unshaded connected, no duplicates
function isSolvedState() {
    const n = currentSize;
    const black = cellStates.map(row => row.map(v => v === 2));
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        if (!black[r][c]) continue;
        if ((r + 1 < n && black[r + 1][c]) || (c + 1 < n && black[r][c + 1])) return false;
    }
    for (let i = 0; i < n; i++) {
        const row = new Set(), col = new Set();
        for (let j = 0; j < n; j++) {
            if (!black[i][j]) { const v = puzzleData.puzzle[i][j]; if (row.has(v)) return false; row.add(v); }
            if (!black[j][i]) { const v = puzzleData.puzzle[j][i]; if (col.has(v)) return false; col.add(v); }
        }
    }
    return HitoriGenerator.isConnected(black, n);
}

// Called exactly once per solved puzzle: stop the clock, lock the board, save the time
function onSolved() {
    if (solved) return;
    if (!started) { started = true; }
    timerPause();
    solved = true;
    boardEl.classList.add('solved');
    const sec = Math.floor(elapsedSec());
    renderTime();
    let extra = '用時 ' + fmtTime(sec);
    if (window.LGT) {
        const shaded = cellStates.flat().filter(v => v === 2).length;
        const res = LGT.addRecord({ value: sec, variant: variantId(), won: true, detail: `${currentSize}×${currentSize} · 塗黑 ${shaded} 格` });
        extra += res.isBest ? '　新紀錄！' : '　·　最快 ' + LGT.format(res.best);
        updateBest();
        hudBestEl.classList.toggle('hud-rec', res.isBest);
    }
    solvedMsg = extra;
    showStatus("Congratulations! You solved it! 🎉", true);
}
let solvedMsg = '';

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
        if (!solved) onSolved();
        else showStatus("Congratulations! You solved it! 🎉", true);
    }
}

function showStatus(msg, isSuccess) {
    statusEl.textContent = msg;
    if (isSuccess && solved && solvedMsg) {
        const sub = document.createElement('span');
        sub.className = 'status-sub';
        sub.textContent = solvedMsg;
        statusEl.appendChild(sub);
    }
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

// records panel opens on the current size's tab; pause the clock while it is open
document.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('#lgtRecBtn') && window.LGT) {
        e.stopImmediatePropagation();
        LGT.openRecords(variantId());
    }
}, true);
window.addEventListener('lgt:records-open', timerPause);
window.addEventListener('lgt:records-close', timerRun);

document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || (window.LGT && LGT.isOpen())) return;
    if (e.key === 't' || e.key === 'T') LGT.cycleTheme();
    else if (e.key === 'Escape' && !modal.classList.contains('hidden')) modal.classList.add('hidden');
});

initGame();
