// 查询所有的 grid 单元格
const gridCells = document.querySelectorAll('.grid-cell');
// 查询显示分数的元素
const scoreElement = document.getElementById('score');

let history = [];
let maxHistoryLength = 5; // 最大历史记录数

// 游戏状态的二维数组
let board = [];
// 游戏分数
let score = 0;

// 初始化棋盘并添加两个初始方块
function initBoard() {
  document.addEventListener('touchmove', (event) => {
    event.preventDefault();
  }, { passive: false });

  for (let i = 0; i < 16; i++) {
    board[i] = ''; // 初始化为空
  }

  addNewTile();
  addNewTile();

  // 更新分数为所有格子数字之和
  score = getScore();
  updateGrid();
}

// 在棋盘上随机位置生成一个新的方块
function addNewTile() {
  let emptyCells = [];
  board.forEach((cell, index) => {
    if (cell === '') emptyCells.push(index); // 收集空单元格的索引
  });

  console.log("当前空白方格数量 :", emptyCells.length);

  if (emptyCells.length > 0) {
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    let newTile = getRandomTile(); // 调用新的函数来获取随机字符
    board[emptyCells[randomIndex]] = newTile;
    updateGrid();
  }
}

function getRandomTile() {
  const randomValue = Math.random();

  if (randomValue < 0.75) { // 75%
    return 'A';
  } else if (randomValue < 0.85) { // 10% (累计 85%)
    return 'B';
  } else if (randomValue < 0.95) { // 10% (累计 95%)
    return 'C';
  } else { // 5%
    return 'D';
  }
}

function updateGrid() {
  console.log("更新棋盘");
  for (let i = 0; i < gridCells.length; i++) {
    const cell = gridCells[i];
    cell.textContent = '';

    // 移除所有额外的类
    cell.className = 'grid-cell'; // 保留原有的grid-cell类

    if (board[i] !== '') {
      cell.textContent = board[i];
      const tileClass = `cell-con-${board[i]}`;
      cell.classList.add(tileClass); // 添加额外的类
    }
    else {
      cell.classList.add('cell-default') // 设置默认背景色
    }
  }

  // 更新分数显示
  scoreElement.textContent = score;
}


// 根据用户键盘输入的方向来移动方块并更新棋盘
function handleMove(direction) {
  let moved = false;
  switch (direction) {
    case 'left':
      console.log("向左移动");
      moved = moveLeft();
      break;
    case 'up':
      console.log("向上移动");
      moved = moveUp();
      break;
    case 'right':
      console.log("向右移动");
      moved = moveRight();
      break;
    case 'down':
      console.log("向下移动");
      moved = moveDown();
      break;
  }

  if (moved) {
    console.log("移动成功，+1 块");
    addNewTile();
    checkGameOver();
    // 保存当前状态到历史记录
    saveState();
  }

  // 更新分数为所有格子数字之和
  score = getScore();
  updateGrid();
}

// 撤销函数
function undo() {
  if (history.length > 0) {
    const previousState = history.pop();
    board = previousState;
    updateGrid();
    score = getScore();
    scoreElement.textContent = score;
  } else {
    console.log("没有更多的历史记录可以撤销");
  }
}

// 保存当前游戏状态到历史记录
function saveState() {
  const currentState = board.slice();
  history.push(currentState);

  if (history.length > maxHistoryLength) {
    history.shift();
  }
}

// 实现向左移动的逻辑
function moveLeft() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    let tempRow = [];
    for (let col = 0; col < 4; col++) {
      if (board[row * 4 + col] !== '') { // 如果不是空字符串
        tempRow.push(board[row * 4 + col]); // 将字母添加到临时行
      }
    }

    tempRow = compress(tempRow); // 压缩行
    let [merged, mergedRow] = merge(tempRow); // 合并行
    tempRow = mergedRow; // 更新压缩后的行

    for (let col = 0; col < 4; col++) {
      let newIndex = row * 4 + col;
      if (mergedRow[col] !== board[newIndex]) { // 如果新旧值不同
        board[newIndex] = mergedRow[col] || ''; // 更新游戏板
        moved = true;
      }
    }
  }

  console.log(moved ? "向左移动成功" : "向左移动失败");

  return moved;
}

// 实现向上移动的逻辑
function moveUp() {
  let moved = false;
  for (let col = 0; col < 4; col++) {
    let tempCol = [];
    for (let row = 0; row < 4; row++) {
      if (board[row * 4 + col] !== '') {
        tempCol.push(board[row * 4 + col]);
      }
    }

    tempCol = compress(tempCol);
    let [merged, mergedCol] = merge(tempCol);
    tempCol = mergedCol;

    for (let row = 0; row < 4; row++) {
      let newIndex = row * 4 + col;
      if (mergedCol[row] !== board[newIndex]) {
        board[newIndex] = mergedCol[row] || '';
        moved = true;
      }
    }
  }

  console.log(moved ? "向上移动成功" : "向上移动失败");

  return moved;
}

// 实现向右移动的逻辑
function moveRight() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    let tempRow = [];
    for (let col = 3; col >= 0; col--) {
      if (board[row * 4 + col] !== '') {
        tempRow.push(board[row * 4 + col]);
      }
    }

    tempRow = compress(tempRow);
    let [merged, mergedRow] = merge(tempRow);
    tempRow = mergedRow;

    for (let col = 3; col >= 0; col--) {
      let newIndex = row * 4 + col;
      if (mergedRow[3 - col] !== board[newIndex]) {
        board[newIndex] = mergedRow[3 - col] || '';
        moved = true;
      }
    }
  }

  console.log(moved ? "向右移动成功" : "向右移动失败");

  return moved;
}


// 实现向下移动的逻辑
function moveDown() {
  let moved = false;
  for (let col = 0; col < 4; col++) {
    let tempCol = [];
    for (let row = 3; row >= 0; row--) {
      if (board[row * 4 + col] !== '') {
        tempCol.push(board[row * 4 + col]);
      }
    }

    tempCol = compress(tempCol);
    let [merged, mergedCol] = merge(tempCol);
    tempCol = mergedCol;

    for (let row = 3; row >= 0; row--) {
      let newIndex = row * 4 + col;
      if (mergedCol[3 - row] !== board[newIndex]) {
        board[newIndex] = mergedCol[3 - row] || '';
        moved = true;
      }
    }
  }

  console.log(moved ? "向下移动成功" : "向下移动失败");

  return moved;
}

// 数组压缩函数
function compress(arr) {
  let result = [];
  arr.forEach(num => {
    if (num !== '') {
      result.push(num);
    }
  });
  while (result.length < 4) {
    result.push('');
  }
  return result;
}

// 数组合并函数
function merge(arr) {
  let merged = false;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1] && arr[i] !== '') {
      arr[i] = getNextTile(arr[i]);
      arr.splice(i + 1, 1);
      arr.push('');
      merged = true;
      i--; // 重新检查当前位置，因为数组长度已经改变
    }
  }
  return [merged, arr];
}

function getNextTile(tile) {
  const tiles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const currentIndex = tiles.indexOf(tile);
  return currentIndex < tiles.length - 1 ? tiles[currentIndex + 1] : '';
}


// 计算当前棋盘上的分数
function getScore() {
  let totalScore = 0;
  const scores = {
    'A': 3,
    'B': 6,
    'C': 12,
    'D': 24,
    'E': 48,
    'F': 96,
    'G': 192,
    'H': 384,
    'I': 768,
    'J': 1536,
    'K': 3072,
    'L': 6144,
    'M': 12288,
    'N': 24576,
    'O': 49152,
    'P': 98304,
    'Q': 196608,
    'R': 393216,
    'S': 786432,
    'T': 1572864,
    'U': 3145728,
    'V': 6291456,
    'W': 12582912,
    'X': 25165824,
    'Y': 50331648,
    'Z': 100663296
  };

  for (let i = 0; i < board.length; i++) {
    totalScore += scores[board[i]] || 0;
  }
  return totalScore;
}

// 检查游戏是否结束
function checkGameOver() {
  let hasEmptyCell = board.some(cell => cell === 0);
  let canMove = false;

  // 检查是否还有空单元格或者是否还有能做出有效动作的单元格
  for (let i = 0; i < 16; i++) {
    // 检查水平方向
    if (i % 4 !== 3 && board[i] === board[i + 1]) {
      canMove = true;
      break;
    }
    // 检查垂直方向
    if (i + 4 < 16 && board[i] === board[i + 4]) {
      canMove = true;
      break;
    }
  }

  if (!hasEmptyCell && !canMove) {
    alert("游戏结束!");
    restart(); // 确保restart函数已经定义
  }
}

// 重新开始游戏
function restart() {
  score = 0;
  initBoard();
}

// 监听键盘事件
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      handleMove('left');
      break;
    case 'ArrowUp':
      handleMove('up');
      break;
    case 'ArrowRight':
      handleMove('right');
      break;
    case 'ArrowDown':
      handleMove('down');
      break;
    case 'z':
      if (event.ctrlKey || event.metaKey) {
        undo();
      }
      break;
  }
});

// 触摸事件支持
let startX, startY, endX, endY;

document.addEventListener('touchstart', (event) => {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (event) => {
  endX = event.changedTouches[0].clientX;
  endY = event.changedTouches[0].clientY;

  if (Math.abs(endX - startX) > Math.abs(endY - startY)) {
    // Horizontal swipe
    if (endX < startX) {
      handleMove('left');
    } else if (endX > startX) {
      handleMove('right');
    }
  } else {
    // Vertical swipe
    if (endY < startY) {
      handleMove('up');
    } else if (endY > startY) {
      handleMove('down');
    }
  }
}, { passive: true });

// 添加用于跟踪鼠标事件的变量
let startMouseX, startMouseY, endMouseX, endMouseY;
let isMouseDown = false;

// 监听鼠标事件
document.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  startMouseX = event.clientX;
  startMouseY = event.clientY;
}, { passive: true });

document.addEventListener('mouseup', (event) => {
  if (isMouseDown) {
    isMouseDown = false;
    endMouseX = event.clientX;
    endMouseY = event.clientY;

    if (Math.abs(endMouseX - startMouseX) > Math.abs(endMouseY - startMouseY)) {
      // 水平拖动
      if (endMouseX < startMouseX) {
        handleMove('left');
      } else if (endMouseX > startMouseX) {
        handleMove('right');
      }
    } else {
      // 垂直拖动
      if (endMouseY < startMouseY) {
        handleMove('up');
      } else if (endMouseY > startMouseY) {
        handleMove('down');
      }
    }
  }
}, { passive: true });

document.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    // 阻止默认行为，例如页面滚动等
    event.preventDefault();
  }
}, { passive: false });

// 初始化游戏
initBoard();