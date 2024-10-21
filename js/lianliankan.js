import { GridPathFinder } from 'https://cdn.jsdelivr.net/npm/fishbb@1.0.25/+esm';

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('gameContainer');
    const resultDiv = document.getElementById('result');
    const startButton = document.getElementById('startButton');
    const nextLevelConfirmation = document.getElementById('nextLevelConfirmation');
    const nextLevelButton = document.getElementById('nextLevelButton');
    const stayButton = document.getElementById('stayButton');

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
            "notExistPotList": [18, 12, 15, 19, 20, 10, 17]
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
            "notExistPotList": [4, 12, 8, 16, 9, 3, 24, 17]
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
    let isDrawing = false;
    let isDrawingSameCell = false;
    let lastValidIndex = -1;
    let previousIndex = -1;

    function createGrid(rows, columns, notExistPotList) {
        console.log('Creating grid with:', { rows, columns, notExistPotList });
        game = new GridPathFinder(rows, columns, notExistPotList);
        gameContainer.innerHTML = '';
        cells = [];
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;
        const cellSize = Math.min(containerWidth / columns, containerHeight / rows);
        if (cellSize <= 0) {
            console.error('Cell size is zero or negative, check container dimensions:', containerWidth, containerHeight);
            return;
        }
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
            cell.addEventListener('touchstart', startTouch);
            cell.addEventListener('touchend', endTouch);
            cell.addEventListener('touchmove', touchDraw);
        });
        console.log('Grid created with', cells.length, 'cells');
    }

    function startDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        console.log('Start drawing at', e.target.dataset.index);
        draw(e);
    }

    function stopDrawing(e) {
        isDrawing = false;
        console.log('Stop drawing');
    }

    function draw(e) {
        if (!isDrawing) return;
        requestAnimationFrame(() => {
            const target = e.target;
            const index = parseInt(target.dataset.index);
            if (cells[index].classList.contains('inactive')) {
                return;
            }

            if (lastValidIndex !== -1) {
                if (lastValidIndex === index) {
                    isDrawingSameCell = true;
                } else {
                    isDrawingSameCell = false;
                    if (!game.areAdjacent(lastValidIndex, index) || game.getPath().includes(index)) {
                        console.log('Path reset due to non-adjacent cell or revisiting cell:', lastValidIndex, index);
                        resetPath();
                        return;
                    }
                }
            }

            if (lastValidIndex !== index) { // 避免连续的重复值
                cells[index].classList.add('active');
                game.setPassedPotAndPath(game.getPath().indexOf(null), index, true);
                previousIndex = lastValidIndex;
                lastValidIndex = index;
                console.log('Draw at', index, 'path:', game.getPath());
            }

            // 检查路径是否完成
            checkPath();
        });
    }

    function resetPath() {
        cells.forEach(cell => cell.classList.remove('active'));
        if (game) {
            game.resetPath();
        }

        lastValidIndex = -1;
        previousIndex = -1;
        console.log('Path reset');
    }

    function checkPath() {
        if (!currentLevel) {
            console.error('Current level is not set');
            return;
        }

        const activeCells = cells.filter(cell => cell.classList.contains('active')).length;
        const totalActiveCells = cells.length - currentLevel.notExistPotList.length;
        console.log('Active cells:', activeCells, 'Total active cells:', totalActiveCells);
        if (game && game.checkPathCompleteness()) {
            resultDiv.textContent = '恭喜，你成功完成了一笔画！';
            console.log('Game completed!');
            nextLevelConfirmation.style.display = 'block';
        } else {
            resultDiv.textContent = '';
            console.log('Game in progress...');
        }
    }

    function nextLevel() {
        nextLevelConfirmation.style.display = 'none';

        lastValidIndex = -1;
        previousIndex = -1;
        isDrawing = false;
        isDrawingSameCell = false;

        const currentLevelIndex = levels.findIndex(level => level.id === currentLevel.id);
        const nextLevelIndex = (currentLevelIndex + 1) % levels.length;
        const nextLevel = levels[nextLevelIndex];
        currentLevel = nextLevel;

        document.getElementById(`level${currentLevel.id}`).disabled = false;

        startGame();
        console.log('Next level started');
    }

    function startGame() {
        console.log('startGame called');
        const selectedLevelId = parseInt(currentLevel.id);
        console.log('Selected level ID:', selectedLevelId);
        const selectedLevel = levels.find(level => level.id === selectedLevelId);
        console.log('Selected level:', selectedLevel);

        resetPath();
        currentLevel = selectedLevel;
        createGrid(selectedLevel.rows, selectedLevel.columns, selectedLevel.notExistPotList);

        // 检查当前关卡是否可以一笔画完成
        if (!game.isOneStroke()) {
            resultDiv.textContent = '此关卡无法一笔画完成，请联系管理员。';
            // console.error('Level cannot be completed in one stroke');
            return;
        }

        resultDiv.textContent = '';
        console.log('Game reset and ready to play');
    }

    function startTouch(e) {
        e.preventDefault();
        isDrawing = true;
        const touch = e.touches[0]; // 获取触摸点
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target) {
            startDrawing({ target, preventDefault: () => { } }); // 传递带有 preventDefault 方法的对象
        }
    }

    function endTouch(e) {
        e.preventDefault();
        stopDrawing(e);
    }

    function touchDraw(e) {
        e.preventDefault();
        if (!isDrawing) return;

        const touch = e.touches[0]; // 获取触摸点
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.dataset.index !== undefined) {
            const newIndex = parseInt(target.dataset.index);
            if (newIndex !== lastValidIndex) { // 只有当手指移动到新的单元格时才绘制
                draw({ target, preventDefault: () => { } }); // 传递带有 preventDefault 方法的对象
            }
        }
    }

    document.querySelectorAll('.level-button').forEach(button => {
        button.addEventListener('click', () => {
            const levelId = parseInt(button.id.replace('level', ''));
            const selectedLevel = levels.find(level => level.id === levelId);
            if (selectedLevel) {
                currentLevel = selectedLevel;
                startGame();
            }
        });
    });

    startButton.addEventListener('click', () => {
        if (currentLevel) {
            startGame();
        } else {
            console.error('No level selected');
        }
    });

    nextLevelButton.addEventListener('click', nextLevel);
    stayButton.addEventListener('click', () => {
        nextLevelConfirmation.style.display = 'none';
        console.log('Stay on current level');
    });

    currentLevel = levels[0];
    startGame();
});