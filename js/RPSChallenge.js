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
    const start = {x: 0, y: 0};
    const end = {x: height - 1, y: width - 1};

    // 启发式函数：曼哈顿距离
    function heuristic(node) {
        return Math.abs(end.x - node.x) + Math.abs(end.y - node.y);
    }

    // 获取相邻节点
    function getNeighbors(node) {
        const directions = [{x: 1, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 0, y: -1}];
        return directions.map(d => ({x: node.x + d.x, y: node.y + d.y}))
            .filter(n => n.x >= 0 && n.x < height && n.y >= 0 && n.y < width)
            .filter(n => board[n.x][n.y] === symbols[(currentPath.length) % 3]);
    }

    // 优先队列
    class PriorityQueue {
        constructor() {
            this.elements = [];
        }
        enqueue(item, priority) {
            this.elements.push({item, priority});
            this.elements.sort((a, b) => a.priority - b.priority);
        }
        dequeue() {
            return this.elements.shift().item;
        }
        isEmpty() {
            return this.elements.length === 0;
        }
    }

    const openSet = new PriorityQueue();
    openSet.enqueue(start, 0);

    const cameFrom = {};
    const gScore = new Map();
    gScore.set(JSON.stringify(start), 0);

    while (!openSet.isEmpty()) {
        const current = openSet.dequeue();

        if (current.x === end.x && current.y === end.y) {
            // 找到了路径
            return true;
        }

        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
            const tentativeGScore = gScore.get(JSON.stringify(current)) + 1;

            if (!gScore.has(JSON.stringify(neighbor)) || tentativeGScore < gScore.get(JSON.stringify(neighbor))) {
                cameFrom[JSON.stringify(neighbor)] = current;
                gScore.set(JSON.stringify(neighbor), tentativeGScore);
                openSet.enqueue(neighbor, tentativeGScore + heuristic(neighbor));
            }
        }
    }

    // 如果没有找到路径
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

document.addEventListener('DOMContentLoaded', () => {
    initializeNotification();
    generateValidGame(gameWidth, gameHeight);
});

generateBtn.addEventListener('click', () => generateValidGame(gameWidth, gameHeight));
restartBtn.addEventListener('click', resetGame);