// Theme picker + local records (shared kit). Score = highest block reached.
LGT.init({
    game: 'twenty',
    title: '二十',
    themes: ['original', 'dark', 'light', 'neo'],
    swatch: 'linear-gradient(135deg,#1e293b 50%,#ef4444 50%)',
    records: { kind: 'score' }
});

const COLS = 5;
const ROWS = 8;
const GAP = 5;
const TILE_SIZE = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tile-size')) || 60;
const TILE_STEP = TILE_SIZE + GAP;

const board = document.getElementById('game-board');
const dangerBar = document.getElementById('danger-bar');
const maxTileEl = document.getElementById('max-tile');
const overlay = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const bestTileEl = document.getElementById('best-tile');
const overSubEl = document.getElementById('over-sub');

let grid = [];
let maxTile = 1;
let isGameOver = false;
let paused = false;   // records panel open
let playMs = 0;       // survived time, excluding pauses
let merges = 0;

// Danger Timer
let dangerTimer = 0;
const DANGER_MAX = 10000; // ms between row pushes
let lastTime = 0;
let animationFrameId;

// Dragging State
let draggedTile = null;
let dragOriginCol = -1;
let dragOriginRow = -1;
let dragStartX = 0;
let dragStartY = 0;
let boardRect = null;

// Block colours live in style.css (.tile.v1 … .tile.v20, per theme).

function initGame() {
    isGameOver = false;
    dangerTimer = 0;
    playMs = 0;
    merges = 0;
    maxTile = 1;
    updateMaxTile();
    overlay.classList.add('hidden');
    board.innerHTML = '';
    
    grid = Array.from({length: COLS}, () => []);
    
    // Initial rows
    for (let r = 0; r < 4; r++) {
        pushRow(true);
    }
    
    cancelAnimationFrame(animationFrameId);
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function createTileElement(val) {
    const el = document.createElement('div');
    el.className = `tile v${Math.min(val, 20)}`;
    el.textContent = val;
    
    el.addEventListener('pointerdown', handlePointerDown);
    board.appendChild(el);
    return { val, el };
}

function pushRow(isInitial = false) {
    if (isGameOver) return;
    
    const maxValFound = grid.flat().reduce((max, t) => Math.max(max, t.val), 1);
    const spawnMax = Math.max(1, maxValFound - 3);
    
    for (let c = 0; c < COLS; c++) {
        const val = Math.floor(Math.random() * spawnMax) + 1;
        const tile = createTileElement(val);
        grid[c].unshift(tile); // Push to bottom (index 0)
    }
    
    checkGameOver();
    renderGrid();
}

function renderGrid() {
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < grid[c].length; r++) {
            const tile = grid[c][r];
            if (tile !== draggedTile) {
                tile.el.style.left = `${GAP + c * TILE_STEP}px`;
                tile.el.style.bottom = `${GAP + r * TILE_STEP}px`;
            }
        }
    }
}

function handlePointerDown(e) {
    if (isGameOver || e.button !== 0 && e.type.includes('mouse')) return;
    
    const target = e.currentTarget;
    
    // Find tile in grid
    for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < grid[c].length; r++) {
            if (grid[c][r].el === target) {
                // Determine if there is vertical space to pull it out
                // We allow dragging ANY tile, but if it has tiles above it, they will fall down immediately
                dragOriginCol = c;
                dragOriginRow = r;
                draggedTile = grid[c][r];
                break;
            }
        }
    }
    
    if (!draggedTile) return;
    
    e.preventDefault();
    target.setPointerCapture(e.pointerId);
    target.classList.add('dragging');
    
    // Remove from logic grid so gravity takes effect on elements above
    grid[dragOriginCol].splice(dragOriginRow, 1);
    renderGrid(); 
    
    boardRect = board.getBoundingClientRect();
    
    // Place exactly at pointer
    updateDragPosition(e);
    
    target.addEventListener('pointermove', handlePointerMove);
    target.addEventListener('pointerup', handlePointerUp);
    target.addEventListener('pointercancel', handlePointerUp);
}

function updateDragPosition(e) {
    let x = e.clientX - boardRect.left - TILE_SIZE / 2;
    let y = e.clientY - boardRect.top - TILE_SIZE / 2;
    // We adjust top to bottom since CSS uses bottom
    let bottom = boardRect.height - y - TILE_SIZE;
    
    draggedTile.el.style.left = `${x}px`;
    draggedTile.el.style.bottom = `${bottom}px`;
}

function handlePointerMove(e) {
    updateDragPosition(e);
}

function handlePointerUp(e) {
    const target = e.currentTarget;
    target.releasePointerCapture(e.pointerId);
    target.classList.remove('dragging');
    
    target.removeEventListener('pointermove', handlePointerMove);
    target.removeEventListener('pointerup', handlePointerUp);
    target.removeEventListener('pointercancel', handlePointerUp);
    
    if (!draggedTile) return;
    
    // Calculate targeted drop column based on pointer event clientX
    let x = e.clientX - boardRect.left;
    let targetCol = Math.floor(x / TILE_STEP);
    
    // Clamp to valid columns
    if (targetCol < 0) targetCol = 0;
    if (targetCol >= COLS) targetCol = COLS - 1;
    
    // Append to target column stack
    grid[targetCol].push(draggedTile);
    
    let currentTileObj = draggedTile;
    draggedTile = null; // Revert immediately so renderGrid applies it
    
    // Check gravity combos in the target column
    resolveGravityCombo(targetCol, currentTileObj);
    renderGrid();
    checkGameOver();
}

function resolveGravityCombo(c, injectedObj) {
    let col = grid[c];
    if (col.length < 2) return;
    
    let topObj = col[col.length - 1]; // Should be injectedObj
    let nextObj = col[col.length - 2];
    
    if (topObj.val === nextObj.val) {
        // Merge!
        let newVal = topObj.val + 1;
        merges++;
        
        // Remove both old DOM elements safely
        topObj.el.remove();
        nextObj.el.remove();
        col.pop();
        col.pop();
        
        // Create new merged tile
        let newObj = createTileElement(newVal);
        col.push(newObj);
        
        if (newVal > maxTile) {
            maxTile = newVal;
            updateMaxTile();
        }
        
        // Recursively check if the new merged tile combos with what's below it!
        resolveGravityCombo(c, newObj);
    }
}

function checkGameOver() {
    for (let c = 0; c < COLS; c++) {
        if (grid[c].length > ROWS) {
            triggerGameOver();
            return;
        }
    }
}

function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;
    const s = Math.round(playMs / 1000);
    const res = LGT.addRecord({
        value: maxTile,
        detail: `撐了 ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} · 合併 ${merges} 次`
    });
    updateMaxTile();
    const isNew = res.isBest && maxTile > 0;
    overSubEl.textContent = isNew ? `最高 ${maxTile} · 新紀錄！` : `最高 ${maxTile} · 最佳 ${LGT.format(LGT.best())}`;
    overSubEl.classList.toggle('is-best', isNew);
    overlay.classList.remove('hidden');
}

function updateMaxTile() {
    maxTileEl.textContent = maxTile;
    const b = LGT.best();
    bestTileEl.textContent = b == null ? '–' : b;
}

function gameLoop(time) {
    if (isGameOver) return;
    
    let delta = time - lastTime;
    lastTime = time;
    
    if (!paused) {
        dangerTimer += delta;
        playMs += delta;
    }
    
    if (dangerTimer >= DANGER_MAX) {
        dangerTimer = 0;
        pushRow();
    }
    
    const pct = (dangerTimer / DANGER_MAX) * 100;
    dangerBar.style.width = `${pct}%`;
    
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Global drop catch in case pointer leaps out
document.addEventListener('pointerup', (e) => {
    if (draggedTile) {
        // We trigger the pointer up manually on the tile
        handlePointerUp({ currentTarget: draggedTile.el, clientX: e.clientX, clientY: e.clientY, pointerId: -1 });
    }
});

restartBtn.addEventListener('click', initGame);

// The row timer stops while the records panel is open.
window.addEventListener('lgt:records-open', () => { paused = true; });
window.addEventListener('lgt:records-close', () => { paused = false; });

document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || LGT.isOpen()) return;
    if (e.key === 't' || e.key === 'T') LGT.cycleTheme();
});

// Resize handler to update boardRect
window.addEventListener('resize', () => {
    boardRect = board.getBoundingClientRect();
});

// Start
initGame();
