class Tetromino {
    constructor() {
        this.spawn();
    }

    spawn() {
        this.typeId = this.randomizeTetrominoType(7);
        this.shape = SHAPES[this.typeId];
        this.color = NEON_COLORS[this.typeId];
        this.x = Math.floor(COLS / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
    }

    randomizeTetrominoType(noOfTypes) {
        return Math.floor(Math.random() * noOfTypes) + 1;
    }

    draw(ctx) {
        this._drawShape(ctx, this.shape, this.x, this.y);
    }
    
    drawAt(ctx, x, y) {
        this._drawShape(ctx, this.shape, x, y);
    }

    _drawShape(ctx, shape, x, y) {
        shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value > 0) {
                    this.drawBlock(ctx, x + dx, y + dy, value);
                }
            });
        });
    }
    
    drawBlock(ctx, x, y, typeId) {
        const color = NEON_COLORS[typeId];
        
        ctx.fillStyle = color;
        // Reset shadow for inner block to avoid blurry performance issues
        ctx.shadowBlur = 0;
        ctx.fillRect(x, y, 1, 1);
        
        // Inner highlight for premium feel
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillRect(x, y, 1, 0.1); // top highlight
        ctx.fillRect(x, y, 0.1, 1); // left highlight
        
        // Border
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 0.05;
        ctx.strokeRect(x, y, 1, 1);
    }

    move(p) {
        this.x = p.x;
        this.y = p.y;
        this.shape = p.shape;
    }
}
