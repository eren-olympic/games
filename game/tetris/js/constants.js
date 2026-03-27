const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = [
    null,
    '#00ffff', // I - Cyan
    '#0000ff', // J - Blue
    '#ffa500', // L - Orange
    '#ffff00', // O - Yellow
    '#00ff00', // S - Green
    '#800080', // T - Purple
    '#ff0000'  // Z - Red
];

// Neon glowing variants
const NEON_COLORS = [
    null,
    '#00f3ff', // I - Cyan
    '#2962ff', // J - Blue
    '#ff9100', // L - Orange
    '#ffe600', // O - Yellow
    '#00e676', // S - Green
    '#d500f9', // T - Purple
    '#ff1744'  // Z - Red
];

const SHAPES = [
    [],
    [ // I
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [ // J
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [ // L
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    [ // O
        [4, 4],
        [4, 4]
    ],
    [ // S
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    [ // T
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    [ // Z
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];
