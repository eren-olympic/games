class Board {
    constructor(ctx, ctxNext, ctxHold) {
        this.ctx = ctx;
        this.ctxNext = ctxNext;
        this.ctxHold = ctxHold;
        
        // Context scaling
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
        this.ctxNext.scale(25, 25);
        this.ctxHold.scale(25, 25);
        
        this.grid = this.getEmptyGrid();
        this.piece = null;
        this.next = null;
        this.hold = null;
        this.canHold = true;
        this.onLineClear = null;
    }

    reset() {
        this.grid = this.getEmptyGrid();
        this.piece = new Tetromino();
        this.getNewPiece();
        this.hold = null;
        this.canHold = true;
    }

    getEmptyGrid() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    valid(p) {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return (
                    value === 0 ||
                    (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
                );
            });
        });
    }

    insideWalls(x) {
        return x >= 0 && x < COLS;
    }

    aboveFloor(y) {
        return y <= ROWS - 1;
    }

    notOccupied(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    rotate(piece) {
        let clone = JSON.parse(JSON.stringify(piece));
        // Transpose
        for (let y = 0; y < clone.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [clone.shape[x][y], clone.shape[y][x]] = [clone.shape[y][x], clone.shape[x][y]];
            }
        }
        // Reverse rows
        clone.shape.forEach(row => row.reverse());
        return clone;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawBoard();
        if (this.piece) {
            this.drawGhost();
            this.piece.draw(this.ctx);
        }
        
        // Draw Next
        this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width, this.ctxNext.canvas.height);
        if (this.next) {
            const dx = 2 - this.next.shape[0].length / 2;
            const dy = 2 - this.next.shape.length / 2;
            this.next.drawAt(this.ctxNext, dx, dy);
        }

        // Draw Hold
        this.ctxHold.clearRect(0, 0, this.ctxHold.canvas.width, this.ctxHold.canvas.height);
        if (this.hold) {
            const dx = 2 - this.hold.shape[0].length / 2;
            const dy = 2 - this.hold.shape.length / 2;
            this.hold.drawAt(this.ctxHold, dx, dy);
        }
    }
    
    drawGhost() {
        const ghost = Object.assign(Object.create(Object.getPrototypeOf(this.piece)), this.piece);
        while (this.valid({ ...ghost, y: ghost.y + 1 })) {
            ghost.y++;
        }
        this.ctx.globalAlpha = 0.2;
        ghost.draw(this.ctx);
        this.ctx.globalAlpha = 1;
    }

    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.piece.drawBlock(this.ctx, x, y, value);
                }
            });
        });
    }

    drop() {
        let p = { ...this.piece, y: this.piece.y + 1 };
        if (this.valid(p)) {
            this.piece.move(p);
        } else {
            this.freeze();
            this.clearLines();
            if (this.piece.y === 0) {
                return false; // Game Over
            }
            this.getNewPiece();
            this.canHold = true;
        }
        return true;
    }

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = value;
                }
            });
        });
    }

    clearLines() {
        let lines = 0;
        this.grid.forEach((row, y) => {
            if (row.every(value => value > 0)) {
                lines++;
                this.grid.splice(y, 1);
                this.grid.unshift(Array(COLS).fill(0));
            }
        });
        
        if (lines > 0 && this.onLineClear) {
            this.onLineClear(lines);
        }
    }
    
    getNewPiece() {
        this.piece = this.next ? this.next : new Tetromino();
        this.next = new Tetromino();
    }
    
    holdPiece() {
        if (!this.canHold) return;
        
        if (this.hold) {
            const temp = this.piece;
            this.piece = this.hold;
            this.hold = temp;
            
            this.piece.x = Math.floor(COLS / 2) - Math.floor(this.piece.shape[0].length / 2);
            this.piece.y = 0;
            // Validate in case holding forces it into another piece (rare but good to check)
            if(!this.valid(this.piece)) {
                // Revert hold
                this.hold = this.piece;
                this.piece = temp;
                return;
            }
        } else {
            this.hold = this.piece;
            this.getNewPiece();
        }
        
        this.canHold = false;
    }
}
