const symbols = ['✊', '✌️', '🖐️'];
let gameBoard = [];
let currentPath = [];
let gameWidth = 5;
let gameHeight = 5;
let startTime = 0;
let timerId = 0;
let steps = 0;

const boardElement = document.getElementById('game-board');
const generateBtn = document.getElementById('generate');
const restartBtn = document.getElementById('restart');
const timeElement = document.getElementById('time');
const stepsElement = document.getElementById('steps');
const notificationElement = document.getElementById('notification');

function initializeNotification() {
    if(notificationElement) {
        notificationElement.style.display = 'none';
    }
}

function notify(message) {
    if(notificationElement) {
        notificationElement.textContent = message;
        notificationElement.style.display = 'block';
        setTimeout(() => notificationElement.style.display = 'none', 3000); // 显示3秒后隐藏
    }
}

function generateGame(width = gameWidth, height = gameHeight) {
    gameBoard = Array(height).fill().map((_, i) => 
        Array(width).fill().map((_, j) => {
            if(i === 0 && j === 0) return '🚩';
            if(i === height-1 && j === width-1) return '🏁';
            return symbols[Math.floor(Math.random() * 3)];
        })
    );
}

function findPathFromStartToEnd(board, width, height) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const queue = [];
    const visited = new Set();

    // 初始状态：起点坐标、已访问集合、下一步需要的符号索引
    queue.push({
        x: 0,
        y: 0,
        step: 0,        // 当前步数（起点不计入顺序）
        visited: 1 << 0 // 使用位图记录访问状态（5x5棋盘用25位）
    });

    while (queue.length > 0) {
        const { x, y, step, visited: state } = queue.shift();

        // 到达终点
        if (x === height - 1 && y === width - 1) return true;

        // 获取下一个需要的符号索引（从第一步开始计算）
        const nextSymbolIndex = step % 3;

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= height || ny < 0 || ny >= width) continue;

            // 计算位图位置（5x5棋盘）
            const bitPosition = nx * width + ny;
            if ((state & (1 << bitPosition)) !== 0) continue;

            const cell = board[nx][ny];
            
            // 特殊处理终点
            if (cell === '🏁') return true;

            // 起点只能出现在初始位置
            if (cell === '🚩') continue;

            // 验证符号规则（第一步可以是任意符号）
            if (step > 0) {
                const currentIndex = symbols.indexOf(cell);
                if (currentIndex !== nextSymbolIndex) continue;
            }

            // 创建新状态（使用位运算快速更新）
            const newState = state | (1 << bitPosition);
            queue.push({
                x: nx,
                y: ny,
                step: step + 1,
                visited: newState
            });
        }
    }
    return false;
}

function generateValidGame(width = gameWidth, height = gameHeight) {
    let valid = false;
    while (!valid) {
        generateGame(width, height);
        valid = findPathFromStartToEnd(gameBoard, width, height);
    }
    renderBoard();
    resetGame();
}

function isValidMove(x, y) {
    const last = currentPath[currentPath.length - 1];
    const dx = Math.abs(x - last.x);
    const dy = Math.abs(y - last.y);
    if(dx > 1 || dy > 1 || (dx === 1 && dy === 1)) return false; // 检查是否为相邻格子
    
    if(currentPath.some(p => p.x === x && p.y === y)) return false; // 检查是否为已走过的位置
    
    const requiredSymbolIndex = (currentPath.length-1) % 3;
    const requiredSymbol = symbols[requiredSymbolIndex];
    return gameBoard[x][y] === requiredSymbol || (x === 0 && y === 0) || (x === gameHeight-1 && y === gameWidth-1);
}

function handleMove(x, y) {
    if(!isValidMove(x, y)) {
        notify("无效移动：不能走已走过的路线或不符合规则！");
        return;
    }
    
    steps++;
    currentPath.push({x, y});
    updateSteps();
    
    if(x === gameHeight-1 && y === gameWidth-1) {
        clearInterval(timerId);
        alert(`游戏胜利！用时: ${timeElement.textContent}秒，步数: ${steps}`);
    }
    
    renderBoard();
}

function renderBoard() {
    boardElement.style.gridTemplateColumns = `repeat(${gameWidth}, 1fr)`;
    boardElement.innerHTML = gameBoard.map((row, i) => 
        row.map((cell, j) => {
            let cls = 'cell';
            if(i === 0 && j === 0) cls += ' start';
            if(i === gameHeight-1 && j === gameWidth-1) cls += ' end';
            if(currentPath.some(p => p.x === i && p.y === j)) cls += ' path';
            return `<div class="${cls}" data-x="${i}" data-y="${j}" onclick="handleMove(${i},${j})">${cell}</div>`;
        }).join('')
    ).join('');
}

function resetGame() {
    steps = 0;
    currentPath = [{x: 0, y: 0}];
    updateSteps();
    clearInterval(timerId);
    startTime = Date.now();
    timerId = setInterval(updateTime, 1000);
}

function updateTime() {
    const currentTime = Date.now();
    timeElement.textContent = Math.floor((currentTime - startTime) / 1000);
}

function updateSteps() {
    stepsElement.textContent = steps;
}

function toggleRules() {
    const modal = document.getElementById('rules-modal');
    if(modal.style.display === "none") {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeNotification();
    generateValidGame(gameWidth, gameHeight);
});

generateBtn.addEventListener('click', () => generateValidGame(gameWidth, gameHeight));
restartBtn.addEventListener('click', resetGame);