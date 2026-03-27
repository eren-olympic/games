const canvas = document.getElementById('board-canvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const ctxNext = nextCanvas.getContext('2d');
const holdCanvas = document.getElementById('hold-canvas');
const ctxHold = holdCanvas.getContext('2d');

let board = new Board(ctx, ctxNext, ctxHold);
let requestId = null;
let time = { start: 0, elapsed: 0, level: 1000 };

let accountValues = {
    score: 0,
    level: 1,
    lines: 0
};

function updateAccount(key, value) {
    let element = document.getElementById(key);
    if (element) {
        element.textContent = value;
    }
}

let account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

const LINE_POINTS = [0, 100, 300, 500, 800];

board.onLineClear = (lines) => {
    account.score += LINE_POINTS[lines] * account.level;
    account.lines += lines;
    // Level up every 10 lines
    if (account.lines >= account.level * 10) {
        account.level++;
        time.level = Math.max(100, 1000 - (account.level - 1) * 100);
        
        // Add a visual flash to board on level up
        canvas.style.filter = 'brightness(2) contrast(1.5)';
        setTimeout(() => {
            canvas.style.filter = 'none';
        }, 300);
    }
};

const KEY_CONFIG = {
    DAS: 150, // Initial delay in ms before repeat
    ARR: 50   // Repeat interval in ms
};
let keyState = {};

const moves = {
    'ArrowLeft': (p) => ({ ...p, x: p.x - 1 }),
    'KeyA': (p) => ({ ...p, x: p.x - 1 }),
    'ArrowRight': (p) => ({ ...p, x: p.x + 1 }),
    'KeyD': (p) => ({ ...p, x: p.x + 1 }),
    'ArrowDown': (p) => ({ ...p, y: p.y + 1 }),
    'KeyS': (p) => ({ ...p, y: p.y + 1 }),
    'ArrowUp': (p) => board.rotate(p),
    'KeyW': (p) => board.rotate(p),
    'Space': (p) => ({ ...p, y: p.y + 1 })
};

function executeMove(code) {
    let p = moves[code](board.piece);

    if (code === 'Space') {
        while (board.valid(p)) {
            account.score += 2; // Hard drop points
            board.piece.move(p);
            p = moves['Space'](board.piece);
        }
        // Force the drop
        if (!board.drop()) {
            gameOver();
            return;
        }
    } else if (board.valid(p)) {
        board.piece.move(p);
        if (code === 'ArrowDown' || code === 'KeyS') {
            account.score += 1; // Soft drop points
        }
    }
    board.draw();
}

function handleKeyDown(event) {
    // Only handle gameplay keys if game is running
    if (event.code === 'KeyP') {
        pause();
        return;
    }

    if (!requestId) return; // Ignore movement when paused or game over
    
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        board.holdPiece();
        board.draw();
        return;
    }

    if (moves[event.code]) {
        event.preventDefault(); // Stop scrolling on arrows/space
        
        // Initial move & setup repeat
        if (!keyState[event.code]) {
            keyState[event.code] = {
                start: performance.now(),
                nextTick: KEY_CONFIG.DAS
            };
            executeMove(event.code);
        }
    }
}

function handleKeyUp(event) {
    if (keyState[event.code]) {
        delete keyState[event.code];
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function play() {
    resetGame();
    time.start = performance.now();
    // If we have an old game loop running, cancel it
    if (requestId) {
        cancelAnimationFrame(requestId);
    }
    animate();
    
    document.getElementById('game-overlay').classList.add('hidden');
}

function resetGame() {
    account.score = 0;
    account.lines = 0;
    account.level = 1;
    time.level = 1000;
    board.reset();
}

function animate(now = 0) {
    time.elapsed = now - time.start;
    
    // Handle held keys (Left, Right, Down)
    ['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD', 'ArrowDown', 'KeyS'].forEach(code => {
        if (keyState[code]) {
            const heldTime = performance.now() - keyState[code].start;
            if (heldTime >= keyState[code].nextTick) {
                executeMove(code);
                keyState[code].nextTick += KEY_CONFIG.ARR;
            }
        }
    });

    if (time.elapsed > time.level) {
        time.start = now;
        if (!board.drop()) {
            gameOver();
            return;
        }
    }

    board.draw();
    requestId = requestAnimationFrame(animate);
}

function gameOver() {
    cancelAnimationFrame(requestId);
    requestId = null;
    
    document.getElementById('overlay-title').textContent = 'GAME OVER';
    document.getElementById('overlay-msg').textContent = 'Score: ' + account.score;
    document.getElementById('start-btn').textContent = 'RESTART';
    document.getElementById('game-overlay').classList.remove('hidden');
    
    // Slight shake animation on game over
    canvas.style.transform = 'translate(5px, 5px)';
    setTimeout(() => canvas.style.transform = 'translate(-5px, -5px)', 50);
    setTimeout(() => canvas.style.transform = 'translate(5px, -5px)', 100);
    setTimeout(() => canvas.style.transform = 'translate(-5px, 5px)', 150);
    setTimeout(() => canvas.style.transform = 'translate(0, 0)', 200);
}

function pause() {
    if (!requestId) {
        // If game is over or hasn't started, don't resume via P
        const titleText = document.getElementById('overlay-title').textContent;
        if (titleText === 'GAME OVER' || titleText === 'Ready?') {
            return;
        }
        
        // Resume
        document.getElementById('game-overlay').classList.add('hidden');
        time.start = performance.now() - time.elapsed;
        animate();
        return;
    }

    cancelAnimationFrame(requestId);
    requestId = null;
    
    document.getElementById('overlay-title').textContent = 'PAUSED';
    document.getElementById('overlay-msg').textContent = 'Press P or button to resume';
    document.getElementById('start-btn').textContent = 'RESUME';
    document.getElementById('game-overlay').classList.remove('hidden');
}

document.getElementById('start-btn').addEventListener('click', () => {
    if (document.getElementById('overlay-title').textContent === 'PAUSED') {
        pause(); // Toggle pause to resume
    } else {
        play();
    }
});
