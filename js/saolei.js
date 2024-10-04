const wrapper = document.querySelector('.wrapper');
const mines = document.querySelector('.mines .remain');
const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset');
const levelList = document.querySelectorAll('.level li');
const timeDisplay = document.querySelector('.time');

let tabRowN = 10; // 行数
let tabColN = 10; // 列数
let mineN = 10; // 雷的数量
let remainMineN = mineN; // 剩余雷数
let openedTabN = 0; // 已打开的单元格数量
let isGameOver = false;
let timer = null;
let seconds = 0;

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
    tabGrid.addEventListener('mousedown', (e) => {
        const target = e.target;
        if (e.button === 0) {
            leftClick(target);
        } else if (e.button === 2) {
            rightClick(target);
        }
    });
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
    if (isGameOver || tab.classList.contains('opened') || tab.classList.contains('flag')) return;

    if (tab.classList.contains('bomb')) {
        tab.classList.add('show');
        clearInterval(timer);
        isGameOver = true;
        console.log('游戏结束，你输了');
    } else {
        openTab(tab);
    }
}

// 右键点击
function rightClick(tab) {
    console.log('右键点击');
    if (isGameOver || tab.classList.contains('opened')) return;

    if (tab.classList.contains('flag')) {
        tab.classList.remove('flag');
        remainMineN++;
    } else {
        tab.classList.add('flag');
        remainMineN--;
    }
    mines.innerText = remainMineN;
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

    if (openedTabN === (tabRowN * tabColN - mineN)) {
        clearInterval(timer);
        isGameOver = true;
        console.log('游戏结束，你赢了');
    }
}

// 重置游戏
function resetGame() {
    console.log('重置游戏');
    initGame();
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
    levelList.forEach(li => li.classList.remove('active'));
    document.querySelector(`.${level}`).classList.add('active');
    initGame();
}

// 事件监听
startBtn.addEventListener('click', () => initGame());
resetBtn.addEventListener('click', () => resetGame());
levelList.forEach(li => li.addEventListener('click', () => selectLevel(li.classList[0])));

// 初始化默认难度
selectLevel('easy');