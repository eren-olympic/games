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

// Theme palette for the canvases. Colours come from CSS custom properties
// (--t1..--t7, --t-style, ...) set per data-theme in style.css; the defaults
// here are the original neon look. Refreshed on the kit's 'lgt:theme' event.
const PAL = {
    style: 'original',              // original | soft | neo
    colors: NEON_COLORS.slice(),
    hi: 'rgba(255,255,255,0.4)',    // highlight
    edge: 'rgba(0,0,0,0.6)',        // outline / shade
    grid: '',                       // grid line colour ('' = none)
    ghost: 0.2                      // ghost piece alpha
};

function loadPalette() {
    const css = name => (window.LGT ? LGT.css(name) : '');
    for (let i = 1; i <= 7; i++) PAL.colors[i] = css('--t' + i) || NEON_COLORS[i];
    PAL.style = css('--t-style') || 'original';
    PAL.hi = css('--t-hi') || 'rgba(255,255,255,0.4)';
    PAL.edge = css('--t-edge') || 'rgba(0,0,0,0.6)';
    PAL.grid = css('--t-grid') === 'none' ? '' : css('--t-grid');
    PAL.ghost = parseFloat(css('--t-ghost')) || 0.2;
}
