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

// 检查棋盘是否存在有效路径（用于生成可解关卡）
function findPathFromStartToEnd(board, width, height) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const queue = [];
    const visitedStates = new Set();

    // 初始状态：起点坐标、已访问位图、上一步符号索引
    queue.push({
        x: 0,
        y: 0,
        prevSymbol: -1, // -1 表示尚未开始移动
        visited: 1 << 0 // 起点已访问
    });

    while (queue.length > 0) {
        const { x, y, prevSymbol, visited } = queue.shift();

        // 到达终点立即返回成功
        if (x === height-1 && y === width-1) return true;

        // 遍历四个方向
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            
            // 边界检查
            if (nx < 0 || nx >= height || ny < 0 || ny >= width) continue;
            
            // 终点特殊处理
            const isEnd = board[nx][ny] === "🏁";
            
            // 获取当前格子符号索引（终点无需检查符号）
            const currentSymbol = isEnd ? null : symbols.indexOf(board[nx][ny]);
            
            // 符号有效性检查（跳过起点和无效符号）
            if (!isEnd && (currentSymbol === -1 || (nx === 0 && ny === 0))) continue;

            // 计算新访问状态
            const bit = nx * width + ny;
            if (visited & (1 << bit)) continue; // 已访问过
            
            // 符号顺序规则验证
            let validStep = false;
            if (prevSymbol === -1) {
                validStep = true; // 第一步可以是任意符号
            } else if (isEnd) {
                validStep = true; // 终点无需验证符号
            } else {
                validStep = currentSymbol === (prevSymbol + 1) % 3;
            }

            if (validStep) {
                const newVisited = visited | (1 << bit);
                const stateKey = `${nx},${ny},${currentSymbol},${newVisited}`;
                
                // 避免重复状态
                if (!visitedStates.has(stateKey)) {
                    visitedStates.add(stateKey);
                    queue.push({
                        x: nx,
                        y: ny,
                        prevSymbol: isEnd ? prevSymbol : currentSymbol, // 终点不改变符号状态
                        visited: newVisited
                    });
                }
            }
        }
    }
    return false;
}


// 检查玩家移动有效性
function isValidMove(x, y) {
    const lastCell = currentPath[currentPath.length - 1];
    
    // 基础检查：不能重复走格
    if (currentPath.some(p => p.x === x && p.y === y)) {
        notify("不能重复经过同一格子！");
        return false;
    }

    // 相邻检查（允许上下左右）
    const dx = Math.abs(x - lastCell.x);
    const dy = Math.abs(y - lastCell.y);
    if (dx + dy !== 1) {
        notify("只能移动到相邻的格子！");
        return false;
    }

    // 首次移动特殊规则
    if (currentPath.length === 1) {
        // 必须从起点(0,0)出发
        if (lastCell.x !== 0 || lastCell.y !== 0) return false;
        // 不能直接到终点
        if (gameBoard[x][y] === "🏁") {
            notify("首次移动不能直达终点！");
            return false;
        }
        return true; // 第一步允许任意符号
    }

    // 后续移动符号顺序验证
    const prevSymbol = symbols.indexOf(
        gameBoard[lastCell.x][lastCell.y]
    );
    const currentSymbol = gameBoard[x][y] === "🏁" 
        ? null 
        : symbols.indexOf(gameBoard[x][y]);

    // 终点特殊处理
    if (gameBoard[x][y] === "🏁") return true;

    // 符号顺序必须满足 (prev + 1) % 3
    if (currentSymbol !== (prevSymbol + 1) % 3) {
        notify(`需要 ${symbols[(prevSymbol + 1) % 3]} 但找到 ${symbols[currentSymbol]}`);
        return false;
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