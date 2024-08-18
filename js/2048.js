// 查询所有的 grid 单元格
const gridCells = document.querySelectorAll('.grid-cell');
// 查询显示分数的元素
const scoreElement = document.getElementById('score');

const backgroundColors = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
  4096: '#edc22e',
  8192: '#edc22e',
  16384: '#edc22e',
  32768: '#edc22e',
  65536: '#edc22e',
};

const textColors = {
  2: '#776e65',
  4: '#776e65',
  8: '#f9f6f2',
  16: '#f9f6f2',
  32: '#f9f6f2',
  64: '#f9f6f2',
  128: '#f9f6f2',
  256: '#f9f6f2',
  512: '#f9f6f2',
  1024: '#f9f6f2',
  2048: '#f9f6f2',
  4096: '#f9f6f2',
  8192: '#f9f6f2',
  16384: '#f9f6f2',
  32768: '#f9f6f2',
  65536: '#f9f6f2',
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
    cell.style.backgroundColor = '#eee';
    cell.style.color = '#333';

    if (board[i] !== 0) {
      cell.textContent = board[i];
      const powerOfTwo = Math.log2(board[i]);
      cell.style.backgroundColor = backgroundColors[powerOfTwo] || '#eee4da';
      cell.style.color = textColors[powerOfTwo] || '#776e65';
    }
  }

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
      score += arr[i];
      arr.splice(i + 1, 1);
      arr.push(0);
      merged = true;
      i--; // 重新检查当前位置，因为数组长度已经改变
    }
  }
  return [merged, arr];
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

initBoard();