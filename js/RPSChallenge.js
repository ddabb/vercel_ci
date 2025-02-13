const symbols = ['✊', '✌️', '🖐️'];
let gameBoard = [];
let currentPath = [];
const gameWidth = 5;
const gameHeight = 5;
let startTime = 0;
let timerId = 0;
let steps = 0;

const boardElement = document.getElementById('game-board');
const generateBtn = document.getElementById('generate');
const restartBtn = document.getElementById('restart');
const timeElement = document.getElementById('time');
const stepsElement = document.getElementById('steps');
const notificationElement = document.getElementById('notification');
const rulesModal = document.getElementById('rules-modal');

// 初始化通知栏
function initializeNotification() {
    if (notificationElement) {
        notificationElement.style.display = 'none';
    }
}

// 显示通知
function notify(message) {
    if (notificationElement) {
        notificationElement.textContent = message;
        notificationElement.style.display = 'block';
        setTimeout(() => {
            notificationElement.style.display = 'none';
        }, 3000);
    }
}

// 生成游戏棋盘
function generateGame(width = gameWidth, height = gameHeight) {
    gameBoard = Array.from({ length: height }, (_, i) =>
        Array.from({ length: width }, (_, j) => {
            if (i === 0 && j === 0) return '🚩'; // 起点
            if (i === height - 1 && j === width - 1) return '🏁'; // 终点
            return symbols[Math.floor(Math.random() * symbols.length)]; // 随机符号
        })
    );
}

// 检查移动是否有效
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

function isValidMove(x, y) {
    // 如果是第一次实际移动（即选择了起点周围的相邻位置）
    if (currentPath.length === 1 && !(x === 0 && y === 0)) { 
        // 检查是否选择了与起点(0,0)相邻的位置
        const adjacentPositions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // 上下左右
        if (!adjacentPositions.some(([dx, dy]) => x === 0 + dx && y === 0 + dy)) {
            notify("首次移动必须选择起点或与起点直接相邻的位置！");
            return false;
        }
        // 确保不选择特殊标记'🏁'
        if (gameBoard[x][y] === '🏁') {
            notify("不能直接移动到终点！");
            return false;
        }
        // 允许首次移动到任意相邻位置
        return true;
    }

    // 获取当前路径中的最后一个坐标
    const last = currentPath[currentPath.length - 1];
    const dx = Math.abs(x - last.x);
    const dy = Math.abs(y - last.y);

    // 检查是否为相邻格子
    if (dx > 1 || dy > 1 || (dx === 1 && dy === 1)) return false;

    // 检查是否为已走过的位置
    if (currentPath.some(p => p.x === x && p.y === y)) return false;

    // 从第二次移动开始应用符号顺序规则
    if (currentPath.length >= 2) { // 注意这里改为>=2，因为首次移动后currentPath长度变为2
        const stepIndex = currentPath.length - 1; // 当前步数索引
        const requiredSymbolIndex = (stepIndex - 1) % symbols.length; // 首次移动不受限制，所以减1
        const requiredSymbol = symbols[requiredSymbolIndex];
        if (gameBoard[x][y] !== requiredSymbol && !(x === gameHeight - 1 && y === gameWidth - 1)) { // 特殊处理终点
            return false;
        }
    }

    return true;
}

// 撤销上一步移动
function undoMove() {
    if (currentPath.length <= 1) return; // 如果只剩起点，则不执行撤销操作

    steps--;
    currentPath.pop();
    updateSteps();
    renderBoard();
}

// 处理玩家移动
function handleMove(x, y) {
    if (!isValidMove(x, y)) {
        notify("无效移动：不能走已走过的路线或不符合规则！");
        return;
    }

    steps++;
    currentPath.push({ x, y });
    updateSteps();

    // 检查是否到达终点
    if (x === gameHeight - 1 && y === gameWidth - 1) {
        clearInterval(timerId);
        alert(`游戏胜利！用时: ${timeElement.textContent}秒，步数: ${steps}`);
    }

    renderBoard();
}

// 渲染游戏棋盘
function renderBoard() {
    if (!boardElement) return;

    boardElement.style.gridTemplateColumns = `repeat(${gameWidth}, 1fr)`;
    boardElement.innerHTML = gameBoard.map((row, i) =>
        row.map((cell, j) => {
            let cls = 'cell';
            if (i === 0 && j === 0) cls += ' start';
            if (i === gameHeight - 1 && j === gameWidth - 1) cls += ' end';
            if (currentPath.some(p => p.x === i && p.y === j)) cls += ' path';
            return `<div class="${cls}" data-x="${i}" data-y="${j}" onclick="handleMove(${i},${j})">${cell}</div>`;
        }).join('')
    ).join('');
}

// 重置游戏状态
function resetGame() {
    steps = 0;
    currentPath = [{ x: 0, y: 0 }];
    updateSteps();
    clearInterval(timerId);
    startTime = Date.now();
    timerId = setInterval(updateTime, 1000);
    renderBoard();
}

// 更新时间显示
function updateTime() {
    if (!timeElement) return;
    const currentTime = Date.now();
    timeElement.textContent = Math.floor((currentTime - startTime) / 1000);
}

// 更新步数显示
function updateSteps() {
    if (stepsElement) {
        stepsElement.textContent = steps;
    }
}

// 切换规则模态框的显示状态
function toggleRules() {
    if (rulesModal) {
        rulesModal.style.display = rulesModal.style.display === "none" ? "block" : "none";
    }
}

// 生成有效游戏
function generateValidGame(width = gameWidth, height = gameHeight) {
    let valid = false;
    while (!valid) {
        generateGame(width, height);
        valid = findPathFromStartToEnd(gameBoard, width, height);
    }
    resetGame();
}

// 初始化游戏
function initializeGame() {
    initializeNotification();
    generateValidGame(gameWidth, gameHeight);
}

// 事件绑定
document.addEventListener('DOMContentLoaded', initializeGame);
generateBtn?.addEventListener('click', () => generateValidGame(gameWidth, gameHeight));
restartBtn?.addEventListener('click', resetGame);