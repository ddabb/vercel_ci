import { GridPathFinder } from 'https://cdn.jsdelivr.net/npm/fishbb@1.0.23/+esm';

const gameContainer = document.getElementById('gameContainer');
const resultDiv = document.getElementById('result');
const levelSelect = document.getElementById('levelSelect');
const startButton = document.getElementById('startButton');

let levels = [
    {
        "id": 1,
        "rows": 5,
        "columns": 5,
        "notExistPotList": [4, 11, 3, 12, 0, 18, 5, 13, 17, 16]
    },
    {
        "id": 2,
        "rows": 5,
        "columns": 6,
        "notExistPotList": [20, 21, 8, 19, 10, 6, 22, 0, 9]
    },
    {
        "id": 3,
        "rows": 5,
        "columns": 5,
        "notExistPotList": [18, 12, 15, 19, 20, 2, 10, 17]
    },
    {
        "id": 4,
        "rows": 5,
        "columns": 5,
        "notExistPotList": [7, 12, 21, 4, 6, 20, 5, 15, 13, 18]
    },
    {
        "id": 5,
        "rows": 5,
        "columns": 5,
        "notExistPotList": [16, 11, 7, 8, 0, 23, 24, 12, 9, 4]
    },
    {
        "id": 6,
        "rows": 5,
        "columns": 5,
        "notExistPotList": [19, 8, 6, 11, 14, 20, 24, 17]
    },
    {
        "id": 7,
        "rows": 5,
        "columns": 5,
        "notExistPotList": [17, 13, 12, 15, 20, 3, 14, 6]
    },
    {
        "id": 8,
        "rows": 5,
        "columns": 5,
        "notExistPotList": [4, 12, 8, 16, 0, 9, 3, 24, 17]
    },
    {
        "id": 9,
        "rows": 5,
        "columns": 5,
        "notExistPotList": [20, 6, 12, 4, 9, 18, 15, 17]
    },
    {
        "id": 10,
        "rows": 5,
        "columns": 5,
        "notExistPotList": [3, 7, 17, 20, 12, 6, 18, 4, 11, 9]
    }
];

let currentLevel = null;
let game;
let cells = [];
let path = [];
let isDrawing = false;

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

levels.forEach(level => {
    const option = document.createElement('option');
    option.value = level.id;
    option.textContent = `关卡 ${level.id}`;
    levelSelect.appendChild(option);
});

startButton.addEventListener('click', startGame);

// 初始化游戏
createGrid(5, 5, levels[0].notExistPotList); // 使用默认关卡初始化游戏