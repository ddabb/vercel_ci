// 查询所有的 grid 单元格
const gridCells = document.querySelectorAll('.grid-cell');
// 查询显示分数的元素
const scoreElement = document.getElementById('score');

const backgroundColors = {
  2: '#eee4da', // A
  4: '#ede0c8', // B
  8: '#f2b179', // C
  16: '#f59563', // D
  32: '#f67c5f', // E
  64: '#f65e3b', // F
  128: '#edcf72', // G
  256: '#edcc61', // H
  512: '#edc850', // I
  1024: '#edc53f', // J
  2048: '#edc22e', // K
  4096: '#298034', // L
  8192: '#1f4e75', // M
  16384: '#e20623', // N
  32768: '#02f30e', // O
  65536: '#04f769', // R
  131072: '#298034', // S (65536 * 2)
  262144: '#1f4e75', // T (65536 * 3)
  524288: '#e20623', // U (65536 * 4)
  1048576: '#02f30e', // V (65536 * 5)
  2097152: '#04f769', // W (65536 * 6)
  4194304: '#04f769', // X (65536 * 7)
  8388608: '#04f769', // Y (65536 * 8)
  16777216: '#04f769', // Z (65536 * 9)
};

const textColors = {
  2: '#776e65', // A
  4: '#776e65', // B
  8: '#f9f6f2', // C
  16: '#f9f6f2', // D
  32: '#f9f6f2', // E
  64: '#f9f6f2', // F
  128: '#f9f6f2', // G
  256: '#f9f6f2', // H
  512: '#f9f6f2', // I
  1024: '#f9f6f2', // J
  2048: '#f9f6f2', // K
  4096: '#f9f6f2', // L
  8192: '#f9f6f2', // M
  16384: '#f9f6f2', // N
  32768: '#f9f6f2', // O
  65536: '#f9f6f2', // R
  131072: '#f9f6f2', // S (65536 * 2)
  262144: '#f9f6f2', // T (65536 * 3)
  524288: '#f9f6f2', // U (65536 * 4)
  1048576: '#f9f6f2', // V (65536 * 5)
  2097152: '#f9f6f2', // W (65536 * 6)
  4194304: '#f9f6f2', // X (65536 * 7)
  8388608: '#f9f6f2', // Y (65536 * 8)
  16777216: '#f9f6f2', // Z (65536 * 9)
};

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
    board[i] = 0;
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
    if (cell === 0) emptyCells.push(index);
  });

  console.log("当前空白方格数量 :", emptyCells.length);

  if (emptyCells.length > 0) {
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    board[emptyCells[randomIndex]] = Math.random() < 0.9 ? 2 : 4;
    updateGrid();
  }
}

function updateGrid() {
  console.log("更新棋盘");
  for (let i = 0; i < gridCells.length; i++) {
    const cell = gridCells[i];
    cell.textContent = '';

    // 移除所有额外的类
    cell.className = 'grid-cell'; // 保留原有的grid-cell类

    if (board[i] !== 0) {
      cell.textContent = board[i];
      const powerOfTwo = Math.log2(board[i]);
      const className = `cell-${2 ** powerOfTwo}`;
      cell.className.add(className); // 添加额外的类
    }
    else {
      cell.className.add('cell-default') //设置默认背景色

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
  }

  // 更新分数为所有格子数字之和
  score = getScore();
  updateGrid();
}

// 实现向左移动的逻辑
function moveLeft() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    let tempRow = [];
    for (let col = 0; col < 4; col++) {
      if (board[row * 4 + col] !== 0) {
        tempRow.push(board[row * 4 + col]);
      }
    }

    tempRow = compress(tempRow);
    let [merged, mergedRow] = merge(tempRow);
    tempRow = mergedRow;

    for (let col = 0; col < 4; col++) {
      let newIndex = row * 4 + col;
      if (mergedRow[col] !== board[newIndex]) {
        board[newIndex] = mergedRow[col] || 0;
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
      if (board[row * 4 + col] !== 0) {
        tempCol.push(board[row * 4 + col]);
      }
    }

    tempCol = compress(tempCol);
    let [merged, mergedCol] = merge(tempCol);
    tempCol = mergedCol;

    for (let row = 0; row < 4; row++) {
      let newIndex = row * 4 + col;
      if (mergedCol[row] !== board[newIndex]) {
        board[newIndex] = mergedCol[row] || 0;
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
      if (board[row * 4 + col] !== 0) {
        tempRow.push(board[row * 4 + col]);
      }
    }

    tempRow = compress(tempRow);
    let [merged, mergedRow] = merge(tempRow);
    tempRow = mergedRow;

    for (let col = 3; col >= 0; col--) {
      let newIndex = row * 4 + col;
      if (mergedRow[3 - col] !== board[newIndex]) {
        board[newIndex] = mergedRow[3 - col] || 0;
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
      if (board[row * 4 + col] !== 0) {
        tempCol.push(board[row * 4 + col]);
      }
    }

    tempCol = compress(tempCol);
    let [merged, mergedCol] = merge(tempCol);
    tempCol = mergedCol;

    for (let row = 3; row >= 0; row--) {
      let newIndex = row * 4 + col;
      if (mergedCol[3 - row] !== board[newIndex]) {
        board[newIndex] = mergedCol[3 - row] || 0;
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
    if (num !== 0) {
      result.push(num);
    }
  });
  while (result.length < 4) {
    result.push(0);
  }
  return result;
}

// 数组合并函数
function merge(arr) {
  let merged = false;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1] && arr[i] !== 0) {
      arr[i] *= 2;

      arr.splice(i + 1, 1);
      arr.push(0);
      merged = true;
      i--; // 重新检查当前位置，因为数组长度已经改变
    }
  }
  return [merged, arr];
}

// 计算当前棋盘上的分数
function getScore() {
  let totalScore = 0;
  for (let i = 0; i < board.length; i++) {
    totalScore += board[i];
  }
  return totalScore;
}

// 检查游戏是否结束
function checkGameOver() {
  let hasEmptyCell = board.some(cell => cell === 0);
  let canMove = false;

  // 检查是否还有空单元格或者是否还有能做出有效动作的单元格
  for (let i = 0; i < 16; i++) {
    if ((i % 4 === 0 && board[i] === board[i + 1]) || (i + 4 < 16 && board[i] === board[i + 4])) {
      canMove = true;
      break;
    }
  }

  if (!hasEmptyCell && !canMove) {
    alert("Game Over!");
    restart();
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