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
    const visited = Array(height).fill().map(() => Array(width).fill(false));
    function dfs(x, y, path) {
        if (x < 0 || y < 0 || x >= height || y >= width || visited[x][y]) return false;
        if (x === height - 1 && y === width - 1) return true;
        visited[x][y] = true;
        
        let requiredSymbolIndex = path.length % 3;
        if (path.length === 0 && !(x === 0 && y === 1)) { // 不是起点后第一个格子
            const requiredSymbol = symbols[requiredSymbolIndex];
            if (board[x][y] !== requiredSymbol) return false;
        }
        
        return dfs(x + 1, y, [...path, {x, y}]) ||
               dfs(x - 1, y, [...path, {x, y}]) ||
               dfs(x, y + 1, [...path, {x, y}]) ||
               dfs(x, y - 1, [...path, {x, y}]);
    }
    return dfs(0, 0, []);
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