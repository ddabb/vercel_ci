import { GridPathFinder } from 'https://cdn.jsdelivr.net/npm/fishbb@1.0.22/+esm';

const gameContainer = document.getElementById('gameContainer');
const resultDiv = document.getElementById('result');
const levelSelect = document.getElementById('levelSelect');
const startButton = document.getElementById('startButton');

let levels = [];
let currentLevel = null;
let game;
let cells = [];
let path = [];
let isDrawing = false;

async function loadLevels() {
    try {
        const response = await fetch('/jsons/levels.json');
        const data = await response.json();
        levels = data.levels.filter(level => {
            const game = new GridPathFinder(level.rows, level.columns, level.notExistPotList);
            return game.isOneStroke();
        });
        levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level.id;
            option.textContent = `关卡 ${level.id}`;
            levelSelect.appendChild(option);
        });
        currentLevel = levels[0];
        createGrid(currentLevel.rows, currentLevel.columns, currentLevel.notExistPotList);
    } catch (error) {
        console.error('Failed to load levels:', error);
    }
}

function createGrid(rows, columns, notExistPotList) {
    game = new GridPathFinder(rows, columns, notExistPotList);
    gameContainer.innerHTML = '';
    cells = [];

    const cellSize = Math.min(gameContainer.clientWidth / columns, gameContainer.clientHeight / rows) - 2;
    gameContainer.style.gridTemplateColumns = `repeat(${columns}, ${cellSize}px)`;
    gameContainer.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

    for (let i = 0; i < rows * columns; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.dataset.index = i;
        if (notExistPotList.includes(i)) {
            cell.classList.add('inactive');
        }
        gameContainer.appendChild(cell);
        cells.push(cell);
    }

    cells.forEach((cell) => {
        cell.addEventListener('mousedown', startDrawing);
        cell.addEventListener('mouseup', stopDrawing);
        cell.addEventListener('mousemove', draw);
        cell.addEventListener('touchstart', startDrawing);
        cell.addEventListener('touchend', stopDrawing);
        cell.addEventListener('touchmove', draw);
    });
}

function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
}

function draw(e) {
    if (!isDrawing) return;
    const target = e.target || e.touches[0].target;
    const index = parseInt(target.dataset.index);
    if (cells[index].classList.contains('active') || cells[index].classList.contains('inactive')) return;
    cells[index].classList.add('active');
    path.push(index);
    checkPath();
}

function checkPath() {
    if (path.length === cells.length - game.notExistPotList.length) {
        resultDiv.textContent = '恭喜，你成功完成了一笔画！';
    } else {
        resultDiv.textContent = '';
    }
}

function startGame() {
    const selectedLevelId = parseInt(levelSelect.value);
    const selectedLevel = levels.find(level => level.id === selectedLevelId);
    if (selectedLevel !== currentLevel) {
        currentLevel = selectedLevel;
        createGrid(selectedLevel.rows, selectedLevel.columns, selectedLevel.notExistPotList);
    }
    resultDiv.textContent = '';
    cells.forEach((cell) => cell.classList.remove('active'));
    path = [];
}

startButton.addEventListener('click', startGame);

// 初始化游戏
loadLevels();