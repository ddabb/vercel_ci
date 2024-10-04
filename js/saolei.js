const wrapper = document.querySelector('.wrapper');
const mines = document.querySelector('.mines .remain');
const startBtn = document.querySelector('#start-btn');
const resetBtn = document.querySelector('#reset-btn');
const levelSelect = document.querySelectorAll('.level-select button');
const timeDisplay = document.querySelector('.time');
const flagSwitch = document.querySelector('#flag-switch'); // 新增插旗开关

let tabRowN = 10; // 行数
let tabColN = 10; // 列数
let mineN = 10; // 雷的数量
let remainMineN = mineN; // 剩余雷数
let openedTabN = 0; // 已打开的单元格数量
let isGameOver = false;
let timer = null;
let seconds = 0;
let isFlagMode = false; // 插旗模式开关

// 初始化游戏
function initGame() {
    console.log('初始化游戏');
    clearInterval(timer);
    seconds = 0;
    timeDisplay.innerText = '00:00';
    remainMineN = mineN;
    openedTabN = 0;
    isGameOver = false;
    mines.innerText = remainMineN;
    createMap(tabRowN, tabColN);
    startTimer();
    // 隐藏游戏结果提示
    const gameResultDiv = document.querySelector('.game-result');
    gameResultDiv.style.display = 'none';
}

// 创建地图
function createMap(tabRowN, tabColN) {
    console.log('创建地图');
    const tabGrid = document.createElement('div');
    tabGrid.className = 'tab-grid';
    wrapper.innerHTML = ''; // 清空之前的地图
    wrapper.appendChild(tabGrid);

    const totalTabs = tabRowN * tabColN;
    const minePositions = new Set();
    while (minePositions.size < mineN) {
        const pos = Math.floor(Math.random() * totalTabs);
        minePositions.add(pos);
    }

    const mines = {};
    for (let pos of minePositions) {
        const row = Math.floor(pos / tabColN);
        const col = pos % tabColN;
        mines[`${row}-${col}`] = true;
    }

    for (let i = 0; i < tabRowN; i++) {
        for (let j = 0; j < tabColN; j++) {
            const tab = document.createElement('div');
            tab.className = 'tab';
            tab.setAttribute('id', `${i}-${j}`);
            if (mines[`${i}-${j}`]) {
                tab.classList.add('bomb');
            }
            tabGrid.appendChild(tab);
        }
    }

    // 动态调整 grid-template-columns 和 grid-template-rows
    tabGrid.style.gridTemplateColumns = `repeat(${tabColN}, 35px)`;
    tabGrid.style.gridTemplateRows = `repeat(${tabRowN}, 35px)`;

    wrapper.style.width = `${tabColN * 35}px`;
    wrapper.style.height = `${tabRowN * 35}px`;

    tabGrid.oncontextmenu = (e) => e.preventDefault();

    // 添加鼠标和触摸事件监听器
    tabGrid.addEventListener('mousedown', (e) => handleMouseEvent(e));
    tabGrid.addEventListener('touchstart', (e) => handleTouchEvent(e));

    // 双击模拟同时按下左右键
    tabGrid.addEventListener('dblclick', (e) => {
        const target = e.target;
        if (target.classList.contains('opened')) {
            autoOpenSurroundingTabs(target);
        }
    });

    tabGrid.addEventListener('touchend', (e) => {
        const target = e.target;
        if (target.classList.contains('tab') && e.touches.length === 0) {
            handleClick(target);
        }
    });
}

// 处理鼠标事件
function handleMouseEvent(e) {
    const target = e.target;
    if (e.button === 0) {
        handleClick(target);
    } else if (e.button === 2) {
        rightClick(target);
    } else if (target.classList.contains('opened') && e.buttons === 3) {
        autoOpenSurroundingTabs(target);
    }
}

// 处理触摸事件
function handleTouchEvent(e) {
    const target = e.target;
    if (e.touches.length === 1) {
        handleClick(target);
    }
}

// 处理点击事件
function handleClick(target) {
    if (isFlagMode) {
        rightClick(target);
    } else {
        leftClick(target);
    }
}

// 开始计时
function startTimer() {
    console.log('开始计时');
    timer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secondsStr = (seconds % 60).toString().padStart(2, '0');
        timeDisplay.innerText = `${minutes}:${secondsStr}`;
    }, 1000);
}

// 左键点击
function leftClick(tab) {
    console.log('左键点击');
    if (isGameOver || tab.classList.contains('flag')) return;

    if (tab.classList.contains('opened')) {
        autoOpenSurroundingTabs(tab);
    } else {
        if (tab.classList.contains('bomb')) {
            tab.classList.add('show');
            clearInterval(timer);
            isGameOver = true;
            showGameResult('游戏结束，你输了');
        } else {
            openTab(tab);
        }
    }
}

// 自动打开周围的格子
function autoOpenSurroundingTabs(tab) {
    const [row, col] = tab.id.split('-').map(Number);
    const mineCount = parseInt(tab.innerText, 10);
    let flagCount = 0;
    let incorrectFlag = false;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < tabRowN && newCol >= 0 && newCol < tabColN) {
                const neighborTab = document.getElementById(`${newRow}-${newCol}`);
                if (neighborTab && neighborTab.classList.contains('flag')) {
                    flagCount++;
                    if (!neighborTab.classList.contains('bomb')) {
                        incorrectFlag = true;
                    }
                }
            }
        }
    }

    if (flagCount === mineCount) {
        if (incorrectFlag) {
            clearInterval(timer);
            isGameOver = true;
            showGameResult('游戏结束，你输了');
            revealAllBombs();
        } else {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < tabRowN && newCol >= 0 && newCol < tabColN) {
                        const neighborTab = document.getElementById(`${newRow}-${newCol}`);
                        if (neighborTab && !neighborTab.classList.contains('flag')) {
                            openTab(neighborTab);
                        }
                    }
                }
            }
        }
    }
}

// 显示所有雷
function revealAllBombs() {
    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => {
        if (tab.classList.contains('bomb')) {
            tab.classList.add('show');
        }
    });
}

// 右键点击
function rightClick(tab) {
    console.log('右键点击', tab);
    if (isGameOver || tab.classList.contains('opened')) return;

    if (tab.classList.contains('flag')) {
        tab.classList.remove('flag');
        remainMineN++;
        console.log('移除旗子');
    } else {
        tab.classList.add('flag');
        remainMineN--;
        console.log('添加旗子');
    }
    mines.innerText = remainMineN;

    // 检查胜利条件
    checkWinCondition();
}

// 打开单元格
function openTab(tab) {
    console.log('打开单元格');
    const [row, col] = tab.id.split('-').map(Number);
    if (tab.classList.contains('opened') || tab.classList.contains('flag')) return;

    let mineCount = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < tabRowN && newCol >= 0 && newCol < tabColN) {
                const neighborTab = document.getElementById(`${newRow}-${newCol}`);
                if (neighborTab && neighborTab.classList.contains('bomb')) {
                    mineCount++;
                }
            }
        }
    }

    tab.classList.add('opened');
    openedTabN++;

    if (mineCount > 0) {
        tab.innerText = mineCount;
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < tabRowN && newCol >= 0 && newCol < tabColN) {
                    const neighborTab = document.getElementById(`${newRow}-${newCol}`);
                    if (neighborTab) {
                        openTab(neighborTab);
                    }
                }
            }
        }
    }

    // 检查胜利条件
    checkWinCondition();
}

// 检查胜利条件
function checkWinCondition() {
    const allTabs = document.querySelectorAll('.tab');
    const nonBombTabs = Array.from(allTabs).filter(tab => !tab.classList.contains('bomb'));
    const openedNonBombTabs = nonBombTabs.filter(tab => tab.classList.contains('opened'));
    const flaggedBombTabs = Array.from(allTabs).filter(tab => tab.classList.contains('bomb') && tab.classList.contains('flag'));

    // 胜利条件：所有非雷的格子都已打开，且所有雷都被正确标记
    if (openedNonBombTabs.length === nonBombTabs.length && flaggedBombTabs.length === mineN) {
        clearInterval(timer);
        isGameOver = true;
        showGameResult('游戏结束，你赢了');
    }
}

// 显示游戏结果
function showGameResult(message) {
    const gameResultDiv = document.querySelector('.game-result');
    gameResultDiv.innerText = message;
    gameResultDiv.classList.remove('win');
    gameResultDiv.style.display = 'block';

    if (message.includes('赢了')) {
        gameResultDiv.classList.add('win');
    } else {
        revealAllBombs();
    }
}

// 重置游戏
function resetGame() {
    console.log('重置游戏');
    initGame();
    const gameResultDiv = document.querySelector('.game-result');
    gameResultDiv.style.display = 'none';
}

// 选择难度
function selectLevel(level) {
    console.log(`选择难度: ${level}`);
    switch (level) {
        case 'easy':
            tabRowN = 10;
            tabColN = 10;
            mineN = 10;
            break;
        case 'normal':
            tabRowN = 16;
            tabColN = 16;
            mineN = 40;
            break;
        case 'hard':
            tabRowN = 16;
            tabColN = 30;
            mineN = 99;
            break;
    }
    levelSelect.forEach(button => button.classList.remove('active'));
    document.querySelector(`[data-level="${level}"]`).classList.add('active');
    initGame();
}

// 插旗开关事件监听
flagSwitch.addEventListener('change', (e) => {
    isFlagMode = e.target.checked;
});

// 事件监听
startBtn.addEventListener('click', () => initGame());
resetBtn.addEventListener('click', () => resetGame());
levelSelect.forEach(button => button.addEventListener('click', () => selectLevel(button.dataset.level)));

// 初始化默认难度
selectLevel('easy');