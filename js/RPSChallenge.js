const config = {
    symbols: ['石头', '剪刀', '布'],
    gridSize: 10,
    start: [0, 0],
    end: [9, 9]
};

let playerPosition = null;
let grid = [];
let path = null;

function createGrid() {
    const container = document.getElementById('gameContainer');
    container.style.gridTemplateRows = `repeat(${config.gridSize}, 30px)`;

    // Pre-generate a path from start to end
    path = generatePath(config.start, config.end);

    for (let row = 0; row < config.gridSize; row++) {
        const rowArray = [];
        for (let col = 0; col < config.gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Set the symbol based on the pre-generated path
            if (path.includes([row, col])) {
                const index = path.indexOf([row, col]);
                cell.textContent = config.symbols[index % config.symbols.length];
            } else {
                const symbolIndex = Math.floor(Math.random() * config.symbols.length);
                cell.textContent = config.symbols[symbolIndex];
            }

            if (row === config.start[0] && col === config.start[1]) cell.classList.add('start');
            if (row === config.end[0] && col === config.end[1]) cell.classList.add('end');
            cell.addEventListener('click', () => movePlayer(row, col));
            container.appendChild(cell);
            rowArray.push(cell);
        }
        grid.push(rowArray);
    }
    placePlayer(config.start[0], config.start[1]);
}

function generatePath(start, end) {
    const path = [start];
    let current = start;

    while (current[0] !== end[0] || current[1] !== end[1]) {
        const possibleMoves = [];
        if (current[0] < end[0]) possibleMoves.push([current[0] + 1, current[1]]);
        if (current[0] > end[0]) possibleMoves.push([current[0] - 1, current[1]]);
        if (current[1] < end[1]) possibleMoves.push([current[0], current[1] + 1]);
        if (current[1] > end[1]) possibleMoves.push([current[0], current[1] - 1]);

        const nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        path.push(nextMove);
        current = nextMove;
    }

    return path;
}

function placePlayer(row, col) {
    if (playerPosition) {
        grid[playerPosition[0]][playerPosition[1]].classList.remove('player');
    }
    grid[row][col].classList.add('player');
    playerPosition = [row, col];
}

function movePlayer(row, col) {
    if (canMoveTo(row, col)) {
        placePlayer(row, col);
        if (row === config.end[0] && col === config.end[1]) {
            alert('Congratulations! You reached the end!');
        }
    }
}

function canMoveTo(row, col) {
    if (row < 0 || row >= config.gridSize || col < 0 || col >= config.gridSize) return false;

    const currentPlayerIndex = path.findIndex(p => p[0] === playerPosition[0] && p[1] === playerPosition[1]);
    const targetIndex = path.findIndex(p => p[0] === row && p[1] === col);

    if (currentPlayerIndex !== -1 && targetIndex !== -1 && targetIndex === currentPlayerIndex + 1) {
        return true;
    }

    const nextSymbolIndex = (config.symbols.indexOf(grid[playerPosition[0]][playerPosition[1]].textContent) + 1) % config.symbols.length;
    return grid[row][col].textContent === config.symbols[nextSymbolIndex];
}

document.addEventListener('DOMContentLoaded', createGrid);