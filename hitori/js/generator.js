class HitoriGenerator {
    static generate(size) {
        // 1. Generate Latin Square
        let grid = Array.from({ length: size }, () => Array(size).fill(0));
        let baseRow = Array.from({ length: size }, (_, i) => i + 1);
        
        // Fisher-Yates shuffle base row
        for (let i = baseRow.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [baseRow[i], baseRow[j]] = [baseRow[j], baseRow[i]];
        }
        
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                grid[r][c] = baseRow[(c + r) % size];
            }
        }
        
        // Shuffle rows
        for (let i = size - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [grid[i], grid[j]] = [grid[j], grid[i]];
        }
        
        // Shuffle columns
        for (let c1 = size - 1; c1 > 0; c1--) {
            const c2 = Math.floor(Math.random() * (c1 + 1));
            for (let r = 0; r < size; r++) {
                [grid[r][c1], grid[r][c2]] = [grid[r][c2], grid[r][c1]];
            }
        }

        // 2. Select Black Cells (solution)
        let blackCells = Array.from({ length: size }, () => Array(size).fill(false));
        const numToBlack = Math.floor((size * size) * 0.35); // Target ~35% black cells
        
        let attempts = 0;
        let blackCount = 0;
        while (blackCount < numToBlack && attempts < 200) {
            attempts++;
            let r = Math.floor(Math.random() * size);
            let c = Math.floor(Math.random() * size);
            
            if (blackCells[r][c]) continue;
            
            // Adjacency check
            let touches = false;
            if (r > 0 && blackCells[r-1][c]) touches = true;
            if (r < size-1 && blackCells[r+1][c]) touches = true;
            if (c > 0 && blackCells[r][c-1]) touches = true;
            if (c < size-1 && blackCells[r][c+1]) touches = true;
            if (touches) continue;
            
            // Connectivity check
            blackCells[r][c] = true;
            if (!this.isConnected(blackCells, size)) {
                blackCells[r][c] = false; // Revert
                continue;
            }
            
            blackCount++;
        }

        // 3. Introduce duplicates in black cells
        let puzzle = grid.map(row => [...row]);
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (blackCells[r][c]) {
                    // Collect valid replacement candidates from unblacked cells in same row/col
                    let candidates = [];
                    for (let x = 0; x < size; x++) {
                        if (x !== c && !blackCells[r][x]) candidates.push(grid[r][x]);
                        if (x !== r && !blackCells[x][c]) candidates.push(grid[x][c]);
                    }
                    if (candidates.length > 0) {
                        puzzle[r][c] = candidates[Math.floor(Math.random() * candidates.length)];
                    }
                }
            }
        }

        return {
            puzzle: puzzle,
            solution: blackCells
        };
    }

    static isConnected(blackCells, size) {
        let visited = Array.from({ length: size }, () => Array(size).fill(false));
        let startR = -1, startC = -1;
        
        // Find first non-black cell
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (!blackCells[r][c]) {
                    startR = r;
                    startC = c;
                    break;
                }
            }
            if (startR !== -1) break;
        }
        
        if (startR === -1) return false;
        
        // BFS
        let queue = [[startR, startC]];
        visited[startR][startC] = true;
        let count = 0;
        
        let totalNonBlack = 0;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (!blackCells[r][c]) totalNonBlack++;
            }
        }
        
        while (queue.length > 0) {
            let [r, c] = queue.shift();
            count++;
            
            const dirs = [[-1,0], [1,0], [0,-1], [0,1]];
            for (const [dr, dc] of dirs) {
                let nr = r + dr;
                let nc = c + dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                    if (!blackCells[nr][nc] && !visited[nr][nc]) {
                        visited[nr][nc] = true;
                        queue.push([nr, nc]);
                    }
                }
            }
        }
        
        return count === totalNonBlack;
    }
}
