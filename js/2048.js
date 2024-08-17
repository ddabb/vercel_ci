const gridCells = document.querySelectorAll('.grid-cell');
const scoreElement = document.getElementById('score');

let board = [];
let score = 0;

// 初始化棋盘
function initBoard() {
    for (let i = 0; i < 16; i++) {
        board[i] = 0;
    }
    addNewTile();
    addNewTile();
}

// 添加新的方块
function addNewTile() {
    let emptyCells = [];
    board.forEach((cell, index) => {
        if (cell === 0) emptyCells.push(index);
    });

    if (emptyCells.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        board[emptyCells[randomIndex]] = Math.random() < 0.9 ? 2 : 4;
        updateGrid();
    }
}

// 更新网格
function updateGrid() {
    gridCells.forEach((cell, index) => {
        cell.textContent = '';
        cell.style.backgroundColor = '#eee';
        cell.style.color = '#333';

        if (board[index] !== 0) {
            cell.textContent = board[index];
            if (board[index] === 2) {
                cell.style.backgroundColor = '#eee4da';
                cell.style.color = '#776e65';
            } else if (board[index] === 4) {
                cell.style.backgroundColor = '#ede0c8';
                cell.style.color = '#776e65';
            } else if (board[index] >= 8) {
                cell.style.backgroundColor = '#f2b179';
                cell.style.color = '#f9f6f2';
            }
        }
    });

    scoreElement.textContent = score;
}

// 处理方向键
function handleMove(direction) {
    let moved = false;
    switch (direction) {
        case 'left':
            moved = moveLeft();
            break;
        case 'up':
            moved = moveUp();
            break;
        case 'right':
            moved = moveRight();
            break;
        case 'down':
            moved = moveDown();
            break;
    }

    if (moved) {
        addNewTile();
        checkGameOver();
    }
}

// 移动逻辑
function moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        let tempRow = [];
        for (let col = 0; col < 4; col++) {
            if (board[row * 4 + col] !== 0) {
                tempRow.push(board[row * 4 + col]);
            }
        }

        tempRow = compress(tempRow);
        tempRow = merge(tempRow);
        tempRow = compress(tempRow);

        for (let col = 0; col < 4; col++) {
            let newIndex = row * 4 + col;
            if (tempRow[col] !== board[newIndex]) {
                board[newIndex] = tempRow[col] || 0;
                moved = true;
            }
        }
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let tempCol = [];
        for (let row = 0; row < 4; row++) {
            if (board[row * 4 + col] !== 0) {
                tempCol.push(board[row * 4 + col]);
            }
        }

        tempCol = compress(tempCol);
        tempCol = merge(tempCol);
        tempCol = compress(tempCol);

        for (let row = 0; row < 4; row++) {
            let newIndex = row * 4 + col;
            if (tempCol[row] !== board[newIndex]) {
                board[newIndex] = tempCol[row] || 0;
                moved = true;
            }
        }
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        let tempRow = [];
        for (let col = 3; col >= 0; col--) {
            if (board[row * 4 + col] !== 0) {
                tempRow.push(board[row * 4 + col]);
            }
        }

        tempRow = compress(tempRow);
        tempRow = merge(tempRow);
        tempRow = compress(tempRow);

        for (let col = 3; col >= 0; col--) {
            let newIndex = row * 4 + col;
            if (tempRow[3 - col] !== board[newIndex]) {
                board[newIndex] = tempRow[3 - col] || 0;
                moved = true;
            }
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let tempCol = [];
        for (let row = 3; row >= 0; row--) {
            if (board[row * 4 + col] !== 0) {
                tempCol.push(board[row * 4 + col]);
            }
        }

        tempCol = compress(tempCol);
        tempCol = merge(tempCol);
        tempCol = compress(tempCol);

        for (let row = 3; row >= 0; row--) {
            let newIndex = row * 4 + col;
            if (tempCol[3 - row] !== board[newIndex]) {
                board[newIndex] = tempCol[3 - row] || 0;
                moved = true;
            }
        }
    }
    return moved;
}

function compress(arr) {
    let result = [];
    arr.forEach(num => {
        if (num !== 0) {
            result.push(num);
        }
    });
    while (result.length < 4) {
        result.push(0);
    }
    return result;
}

function merge(arr) {
    let merged = false;
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1] && arr[i] !== 0) {
            arr[i] *= 2;
            score += arr[i];
            arr.splice(i + 1, 1);
            arr.push(0);
            merged = true;
        }
    }
    return [merged, arr];
}

function checkGameOver() {
    let hasEmptyCell = board.some(cell => cell === 0);
    let canMove = false;

    // Check if there are any possible moves left
    for (let i = 0; i < 16; i++) {
        if (i % 4 === 0 && board[i] === board[i + 1] ||
            (i + 4 < 16) && board[i] === board[i + 4]) {
            canMove = true;
            break;
        }
    }

    if (!hasEmptyCell && !canMove) {
        alert("Game Over!");
        restart();
    }
}

function restart() {
    score = 0;
    initBoard();
}

// 监听键盘事件
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            handleMove('left');
            break;
        case 'ArrowUp':
            handleMove('up');
            break;
        case 'ArrowRight':
            handleMove('right');
            break;
        case 'ArrowDown':
            handleMove('down');
            break;
    }
});

// 触摸事件支持
let startX, startY, endX, endY;

document.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (event) => {
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;

    if (Math.abs(endX - startX) > Math.abs(endY - startY)) {
        // Horizontal swipe
        if (endX < startX) {
            handleMove('left');
        } else if (endX > startX) {
            handleMove('right');
        }
    } else {
        // Vertical swipe
        if (endY < startY) {
            handleMove('up');
        } else if (endY > startY) {
            handleMove('down');
        }
    }
}, { passive: true });

initBoard();