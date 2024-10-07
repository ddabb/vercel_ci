// array-puzzle.js

const gridSize = 4; // Adjust based on your grid size
let grid = [];
let initialRowHints = [3, 2, 1, 4]; // Example row hints
let initialColHints = [2, 1, 3, 2]; // Example column hints
let history = []; // To keep track of changes for undo functionality

function initializeGrid() {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
        grid[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.addEventListener('click', () => handleCellClick(row, col));
            gridContainer.appendChild(cell);
            grid[row][col] = { element: cell, value: null };
        }
    }
    resetGridValues();
}

function resetGridValues() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            grid[row][col].value = null;
            grid[row][col].element.classList.remove('painted', 'x-marked');
        }
    }
}

function handleCellClick(row, col) {
    if (grid[row][col].value === null) {
        grid[row][col].value = 1;
        grid[row][col].element.classList.add('painted');
        history.push({ row, col, value: 1 });
    } else if (grid[row][col].value === 1) {
        grid[row][col].value = 0;
        grid[row][col].element.classList.remove('painted');
        grid[row][col].element.classList.add('x-marked');
        history.push({ row, col, value: 0 });
    }
    checkGridValidity();
}

function checkGridValidity() {
    let isValid = true;
    for (let row = 0; row < gridSize; row++) {
        let consecutiveOnes = 0;
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col].value === 1) {
                consecutiveOnes++;
            } else {
                consecutiveOnes = 0;
            }
            if (consecutiveOnes > initialRowHints[row]) {
                isValid = false;
                break;
            }
        }
    }

    for (let col = 0; col < gridSize; col++) {
        let consecutiveOnes = 0;
        for (let row = 0; row < gridSize; row++) {
            if (grid[row][col].value === 1) {
                consecutiveOnes++;
            } else {
                consecutiveOnes = 0;
            }
            if (consecutiveOnes > initialColHints[col]) {
                isValid = false;
                break;
            }
        }
    }

    if (!isValid) {
        alert('Invalid move! Please try again.');
        undo();
    } else {
        alert('Valid move!');
    }
}

function restart() {
    resetGridValues();
    initializeGrid();
}

function undo() {
    if (history.length > 0) {
        const lastChange = history.pop();
        grid[lastChange.row][lastChange.col].value = null;
        grid[lastChange.row][lastChange.col].element.classList.remove('painted', 'x-marked');
        checkGridValidity();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
});