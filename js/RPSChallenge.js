const symbols = ['✊', '✌️', '🖐️'];
let gameBoard = [];
let currentPath = [];
let gameSize = 5;
let startTime = 0;
let timerId = 0;
let steps = 0;

const boardElement = document.getElementById('game-board');
const generateBtn = document.getElementById('generate');
const restartBtn = document.getElementById('restart');
const timeElement = document.getElementById('time');
const stepsElement = document.getElementById('steps');

function generateGame() {
    gameBoard = Array(gameSize).fill().map((_, i) => 
        Array(gameSize).fill().map((_, j) => {
            if((i === 0 && j === 0) || (i === gameSize-1 && j === gameSize-1)) return '';
            return symbols[Math.floor(Math.random() * 3)];
        })
    );
    renderBoard();
    resetGame();
}

function renderBoard() {
    boardElement.style.gridTemplateColumns = `repeat(${gameSize}, 1fr)`;
    boardElement.innerHTML = gameBoard.map((row, i) => 
        row.map((cell, j) => {
            let cls = 'cell';
            if(i === 0 && j === 0) cls += ' start';
            if(i === gameSize-1 && j === gameSize-1) cls += ' end';
            if(currentPath.some(p => p.x === i && p.y === j)) cls += ' path';
            return `<div class="${cls}" data-x="${i}" data-y="${j}">${cell}</div>`;
        }).join('')
    ).join('');
}

function resetGame() {
    currentPath = [{x:0, y:0}];
    steps = 0;
    startTime = Date.now();
    clearInterval(timerId);
    timerId = setInterval(updateTime, 1000);
    updateSteps();
    renderBoard();
}

function isValidMove(x, y) {
    const last = currentPath[currentPath.length - 1];
    const dx = Math.abs(x - last.x);
    const dy = Math.abs(y - last.y);
    if((dx === 1 && dy !== 0) || (dy === 1 && dx !== 0)) return false;
    
    if(currentPath.some(p => p.x === x && p.y === y)) return false;
    
    if(currentPath.length === 1) return true;
    
    const requiredSymbol = symbols[(currentPath.length-1) % 3];
    return gameBoard[x][y] === requiredSymbol;
}

function handleMove(x, y) {
    if(!isValidMove(x, y)) return;
    
    steps++;
    currentPath.push({x, y});
    updateSteps();
    
    if(x === gameSize-1 && y === gameSize-1) {
        clearInterval(timerId);
        alert(`游戏胜利！用时: ${timeElement.textContent}秒，步数: ${steps}`);
    }
    
    renderBoard();
}

document.addEventListener('DOMContentLoaded', generateGame);
generateBtn.addEventListener('click', generateGame);
restartBtn.addEventListener('click', resetGame);

boardElement.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if(!cell) return;
    
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    handleMove(x, y);
});

// 触摸控制
let touchStartX = 0;
let touchStartY = 0;

boardElement.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

boardElement.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    
    if(Math.abs(dx) > Math.abs(dy)) {
        handleSwipe(dx > 0 ? 'right' : 'left');
    } else {
        handleSwipe(dy > 0 ? 'down' : 'up');
    }
});

document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        handleSwipe(btn.dataset.direction);
    });
});

function handleSwipe(direction) {
    const last = currentPath[currentPath.length - 1];
    let x = last.x, y = last.y;
    
    switch(direction) {
        case 'up': x--; break;
        case 'down': x++; break;
        case 'left': y--; break;
        case 'right': y++; break;
    }
    
    if(x >= 0 && x < gameSize && y >= 0 && y < gameSize) {
        handleMove(x, y);
    }
}

function updateTime() {
    timeElement.textContent = Math.floor((Date.now() - startTime) / 1000);
}

function updateSteps() {
    stepsElement.textContent = steps;
}