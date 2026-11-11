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
        const color = PAL.colors[typeId];

        if (PAL.style === 'soft') {
            // dark / light: rounded tile with a small gloss pill
            ctx.shadowBlur = 0;
            ctx.fillStyle = color;
            roundBox(ctx, x + 0.05, y + 0.05, 0.9, 0.9, 0.2);
            ctx.fillStyle = PAL.edge;
            ctx.fillRect(x + 0.2, y + 0.78, 0.6, 0.07);
            ctx.fillStyle = PAL.hi;
            roundBox(ctx, x + 0.18, y + 0.14, 0.64, 0.14, 0.07);
            return;
        }
        if (PAL.style === 'neo') {
            // neubrutalism: flat fill, thick black outline, hard inner shade
            ctx.shadowBlur = 0;
            ctx.fillStyle = color;
            ctx.fillRect(x + 0.04, y + 0.04, 0.92, 0.92);
            ctx.fillStyle = PAL.edge;
            ctx.fillRect(x + 0.04, y + 0.78, 0.92, 0.18);
            ctx.fillRect(x + 0.78, y + 0.04, 0.18, 0.92);
            ctx.fillStyle = PAL.hi;
            ctx.fillRect(x + 0.2, y + 0.2, 0.18, 0.18);
            ctx.strokeStyle = '#111';
            ctx.lineWidth = 0.09;
            ctx.strokeRect(x + 0.085, y + 0.085, 0.83, 0.83);
            return;
        }

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

function roundBox(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
    ctx.fill();
}
