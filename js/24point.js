// 游戏数据
let gameData = {
  numbers: [1, 2, 3, 4], // 当前游戏的4个数字
  expression: '', // 用户输入的表达式
  showResult: false, // 是否显示结果
  isCorrect: false, // 答案是否正确
  resultMessage: '', // 结果消息
  showingHint: false, // 是否显示提示
  currentHint: '', // 当前提示内容
  showingSolution: false, // 是否显示答案
  solutions: [], // 所有解决方案
  solutionFound: false, // 是否已找到答案
  gamesPlayed: 0, // 已玩游戏局数
  correctAnswers: 0, // 答对题数
  accuracy: 0, // 正确率
  gameHistory: [], // 游戏历史
  // 游戏模式：'preset'（预设模式） 或 'custom'（自定义模式）
  gameMode: 'preset',
  // 自定义数字相关
  customNumbers: ['', '', '', ''], // 自定义输入的4个数字
  customNumbersValid: false, // 自定义数字是否有效（4个数字都已输入）
  showSolvabilityResult: false, // 是否显示可解性结果
  isSolvable: false, // 自定义数字是否有解
  solvabilityMessage: '', // 可解性消息
  customSolutions: [], // 自定义数字的解法
  hints: [
    "尝试先将两个数字组合成容易计算的数，比如 3×8=24、4×6=24、12×2=24",
    "可以先算出 24 的因数，然后看能否用其他数字得到对应的另一个因数",
    "不要忽视括号的作用，它可以改变运算顺序",
    "除法可以产生分数，有时分数运算能得到意想不到的结果",
    "试试先把两个数字相加或相减，看看能不能简化问题",
    "记住：每个数字必须使用且只能使用一次"
  ],
  // 预定义的一些24点题目和答案
  questionBank: [
    { numbers: [1, 2, 3, 4], solutions: [
      { expression: "(1+2+3)×4", description: "先相加得到6，再乘以4" },
      { expression: "(1×2×3)×4", description: "连乘得到24" }
    ]},
    { numbers: [2, 3, 4, 6], solutions: [
      { expression: "6×4×(3-2)", description: "利用差值简化计算" },
      { expression: "(6-3)×2×4", description: "先做减法得到3" }
    ]},
    { numbers: [3, 3, 8, 8], solutions: [
      { expression: "8÷(3-8÷3)", description: "经典的分式解法" }
    ]},
    { numbers: [1, 3, 5, 7], solutions: [
      { expression: "(7-3)×(1+5)", description: "分组计算得到4和6" }
    ]},
    { numbers: [4, 4, 10, 10], solutions: [
      { expression: "(10×10-4)÷4", description: "利用平方差公式思路" }
    ]},
    { numbers: [5, 5, 5, 1], solutions: [
      { expression: "(5-1÷5)×5", description: "分数运算的经典例子" }
    ]},
    { numbers: [6, 6, 8, 8], solutions: [
      { expression: "(6÷(8-6))×8", description: "先做减法，再除法，最后乘法" },
      { expression: "(8÷(8-6))×6", description: "另一种顺序" }
    ]}
  ]
};

// DOM 元素
const elements = {
  controlSection: document.getElementById('controlSection'),
  numbersDisplay: document.getElementById('numbersDisplay'),
  presetControls: document.getElementById('presetControls'),
  customControls: document.getElementById('customControls'),
  solvabilitySection: document.getElementById('solvabilitySection'),
  solvabilityBox: document.getElementById('solvabilityBox'),
  solvabilityIcon: document.getElementById('solvabilityIcon'),
  solvabilityMessage: document.getElementById('solvabilityMessage'),
  solvabilitySolutions: document.getElementById('solvabilitySolutions'),
  solutionCount: document.getElementById('solutionCount'),
  globalControlSection: document.getElementById('globalControlSection'),
  expressionInput: document.getElementById('expressionInput'),
  clearBtn: document.getElementById('clearBtn'),
  checkBtn: document.getElementById('checkBtn'),
  resultSection: document.getElementById('resultSection'),
  resultBox: document.getElementById('resultBox'),
  resultIcon: document.getElementById('resultIcon'),
  resultMessage: document.getElementById('resultMessage'),
  resultExpression: document.getElementById('resultExpression'),
  expressionDisplay: document.getElementById('expressionDisplay'),
  hintSection: document.getElementById('hintSection'),
  hintText: document.getElementById('hintText'),
  solutionSection: document.getElementById('solutionSection'),
  solutionList: document.getElementById('solutionList'),
  statsSection: document.getElementById('statsSection'),
  gamesPlayed: document.getElementById('gamesPlayed'),
  correctAnswers: document.getElementById('correctAnswers'),
  accuracy: document.getElementById('accuracy'),
  historySection: document.getElementById('historySection'),
  historyList: document.getElementById('historyList'),
  checkSolvabilityBtn: document.getElementById('checkSolvabilityBtn'),
  useCustomNumbersBtn: document.getElementById('useCustomNumbersBtn'),
  hintBtn: document.getElementById('hintBtn'),
  solutionBtn: document.getElementById('solutionBtn')
};

// 更新数字显示
function updateNumbersDisplay() {
  const numbers = gameData.numbers;
  let numbersHTML = '';
  numbers.forEach((num, index) => {
    const classes = ['number-card'];
    if (index === 0) classes.push('first');
    if (index === 1) classes.push('second');
    if (index === 2) classes.push('third');
    if (index === 3) classes.push('fourth');
    numbersHTML += `<div class="${classes.join(' ')}">
      <span class="number-text">${num}</span>
    </div>`;
  });
  elements.numbersDisplay.innerHTML = numbersHTML;
}

// 设置表达式
function setExpression(value) {
  gameData.expression = value;
  gameData.showResult = false;
  
  // 显示/隐藏清除按钮
  elements.clearBtn.style.display = value ? 'flex' : 'none';
  // 启用/禁用检查按钮
  elements.checkBtn.disabled = !value;
  
  // 隐藏结果
  elements.resultSection.style.display = 'none';
}

// 清空表达式
function clearExpression() {
  gameData.expression = '';
  gameData.showResult = false;
  elements.expressionInput.value = '';
  elements.clearBtn.style.display = 'none';
  elements.checkBtn.disabled = true;
  elements.resultSection.style.display = 'none';
}

// 自定义数字输入处理
function handleCustomInput(index, value) {
  gameData.customNumbers[index] = value;
  
  // 检查四个数字是否都已输入（非空且为有效数字）
  const allFilled = gameData.customNumbers.every(num => num !== '' && !isNaN(parseInt(num)));
  
  gameData.customNumbersValid = allFilled;
  gameData.showSolvabilityResult = false;
  
  // 启用/禁用按钮
  elements.checkSolvabilityBtn.disabled = !allFilled;
  elements.useCustomNumbersBtn.disabled = !allFilled;
  
  // 隐藏可解性结果
  elements.solvabilitySection.style.display = 'none';
}

// 随机生成自定义数字（0-24之间的4个随机整数）
function generateRandomCustomNumbers() {
  const randomNumbers = [];
  for (let i = 0; i < 4; i++) {
    // 生成0-24之间的随机整数
    randomNumbers.push(Math.floor(Math.random() * 25).toString());
  }
  
  gameData.customNumbers = randomNumbers;
  gameData.customNumbersValid = true;
  gameData.showSolvabilityResult = false;
  
  // 更新输入框
  for (let i = 0; i < 4; i++) {
    document.getElementById(`customInput${i+1}`).value = randomNumbers[i];
  }
  
  // 启用按钮
  elements.checkSolvabilityBtn.disabled = false;
  elements.useCustomNumbersBtn.disabled = false;
  
  // 隐藏可解性结果
  elements.solvabilitySection.style.display = 'none';
}

// 检查自定义数字是否有解
function checkSolvability() {
  if (!gameData.customNumbersValid) {
    alert('请输入4个有效整数');
    return;
  }
  
  // 转换为数字数组
  const numbers = gameData.customNumbers.map(num => parseInt(num));
  
  // 检查是否有解
  const solutions = solve24(numbers);
  const isSolvable = solutions.length > 0;
  
  gameData.showSolvabilityResult = true;
  gameData.isSolvable = isSolvable;
  gameData.solvabilityMessage = isSolvable ? 
    `数字 [${numbers.join(', ')}] 可以计算出24！` : 
    `数字 [${numbers.join(', ')}] 无法计算出24。`;
  gameData.customSolutions = solutions;
  
  // 更新UI
  elements.solvabilitySection.style.display = 'block';
  elements.solvabilityBox.className = `solvability-box ${isSolvable ? 'solvable' : 'unsolvable'}`;
  elements.solvabilityIcon.textContent = isSolvable ? '✅' : '❌';
  elements.solvabilityMessage.textContent = gameData.solvabilityMessage;
  
  // 更新解法列表
  if (isSolvable && solutions.length > 0) {
    let solutionsHTML = '';
    solutions.forEach(solution => {
      solutionsHTML += `<div class="solution-item">
        <span class="solution-expression">${solution.expression} = 24</span>
      </div>`;
    });
    elements.solvabilitySolutions.innerHTML = `<div class="solution-count">找到 ${solutions.length} 种解法:</div>${solutionsHTML}`;
  } else {
    elements.solvabilitySolutions.innerHTML = '';
  }
}

// 使用自定义数字开始游戏
function useCustomNumbers() {
  if (!gameData.customNumbersValid) {
    alert('请输入4个有效整数');
    return;
  }
  
  const numbers = gameData.customNumbers.map(num => parseInt(num));
  
  // 打乱数字顺序
  const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
  
  // 尝试查找解法
  const solutions = solve24(numbers);
  
  gameData.gameMode = 'custom';
  gameData.numbers = shuffledNumbers;
  gameData.expression = '';
  gameData.showResult = false;
  gameData.showingHint = false;
  gameData.showingSolution = false;
  gameData.solutionFound = false;
  gameData.solutions = solutions;
  gameData.showSolvabilityResult = false;
  
  // 更新UI
  elements.expressionInput.value = '';
  elements.clearBtn.style.display = 'none';
  elements.checkBtn.disabled = true;
  elements.solvabilitySection.style.display = 'none';
  
  // 显示数字
  elements.controlSection.classList.remove('hidden-control');
  updateNumbersDisplay();
}

// 安全表达式求值函数（替代eval，避免安全问题）
function safeEval(expression) {
  // 移除所有空格
  let expr = expression.replace(/\s+/g, '');
  
  // 运算符优先级映射
  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  };
  
  // 双栈：操作数栈和运算符栈
  const values = [];
  const ops = [];
  
  // 辅助函数：应用运算符
  const applyOp = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': 
        if (Math.abs(b) < 0.000001) throw new Error('除零错误');
        return a / b;
      default: throw new Error(`未知运算符: ${op}`);
    }
  };
  
  // 辅助函数：处理栈顶运算符
  const processTopOp = () => {
    if (ops.length < 1 || values.length < 2) return;
    const b = values.pop();
    const a = values.pop();
    const op = ops.pop();
    values.push(applyOp(a, b, op));
  };
  
  let i = 0;
  while (i < expr.length) {
    // 处理数字
    if (expr[i] >= '0' && expr[i] <= '9') {
      let num = '';
      while (i < expr.length && (expr[i] >= '0' && expr[i] <= '9' || expr[i] === '.')) {
        num += expr[i];
        i++;
      }
      values.push(parseFloat(num));
      continue;
    }
    
    // 处理左括号
    if (expr[i] === '(') {
      ops.push('(');
      i++;
      continue;
    }
    
    // 处理右括号
    if (expr[i] === ')') {
      while (ops.length > 0 && ops[ops.length - 1] !== '(') {
        processTopOp();
      }
      if (ops.length === 0) throw new Error('括号不匹配');
      ops.pop(); // 移除左括号
      i++;
      continue;
    }
    
    // 处理运算符
    if (['+', '-', '*', '/'].includes(expr[i])) {
      // 处理负号（一元减号）
      if (expr[i] === '-' && (i === 0 || expr[i-1] === '(' || ['+', '-', '*', '/'].includes(expr[i-1]))) {
        // 一元负号：读取下一个数字作为负数
        i++;
        if (expr[i] >= '0' && expr[i] <= '9') {
          let num = '-';
          while (i < expr.length && (expr[i] >= '0' && expr[i] <= '9' || expr[i] === '.')) {
            num += expr[i];
            i++;
          }
          values.push(parseFloat(num));
        } else {
          throw new Error('无效的一元负号');
        }
        continue;
      }
      
      // 二元运算符
      while (ops.length > 0 && ops[ops.length - 1] !== '(' && 
             precedence[ops[ops.length - 1]] >= precedence[expr[i]]) {
        processTopOp();
      }
      ops.push(expr[i]);
      i++;
      continue;
    }
    
    // 未知字符
    throw new Error(`无效字符: ${expr[i]}`);
  }
  
  // 处理剩余运算符
  while (ops.length > 0) {
    if (ops[ops.length - 1] === '(') throw new Error('括号不匹配');
    processTopOp();
  }
  
  if (values.length !== 1) throw new Error('表达式无效');
  return values[0];
}

// 24点求解算法
function solve24(numbers) {
  if (numbers.length !== 4) return [];
  
  const solutions = [];
  const ops = ['+', '-', '*', '/'];
  
  // 递归函数：尝试所有可能的运算
  const solve = (nums, exprs) => {
    if (nums.length === 1) {
      if (Math.abs(nums[0] - 24) < 0.000001) {
        solutions.push(exprs[0]);
      }
      return;
    }
    
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        // 选择两个数字 nums[i] 和 nums[j]
        const a = nums[i];
        const b = nums[j];
        const aExpr = exprs[i];
        const bExpr = exprs[j];
        
        // 剩余数字
        const remainingNums = [];
        const remainingExprs = [];
        for (let k = 0; k < nums.length; k++) {
          if (k !== i && k !== j) {
            remainingNums.push(nums[k]);
            remainingExprs.push(exprs[k]);
          }
        }
        
        // 尝试所有运算符
        for (const op of ops) {
          // 加法、乘法满足交换律，避免重复
          if ((op === '+' || op === '*') && i > j) continue;
          
          let newVal, newExpr;
          switch (op) {
            case '+':
              newVal = a + b;
              newExpr = `(${aExpr}+${bExpr})`;
              solve([newVal, ...remainingNums], [newExpr, ...remainingExprs]);
              break;
            case '-':
              // 减法不满足交换律，尝试两种顺序
              // a - b
              newVal = a - b;
              newExpr = `(${aExpr}-${bExpr})`;
              solve([newVal, ...remainingNums], [newExpr, ...remainingExprs]);
              // b - a
              newVal = b - a;
              newExpr = `(${bExpr}-${aExpr})`;
              solve([newVal, ...remainingNums], [newExpr, ...remainingExprs]);
              break;
            case '*':
              newVal = a * b;
              newExpr = `(${aExpr}×${bExpr})`;
              solve([newVal, ...remainingNums], [newExpr, ...remainingExprs]);
              break;
            case '/':
              // 除法不满足交换律，尝试两种顺序（除数不能为0）
              if (Math.abs(b) > 0.000001) {
                newVal = a / b;
                newExpr = `(${aExpr}÷${bExpr})`;
                solve([newVal, ...remainingNums], [newExpr, ...remainingExprs]);
              }
              if (Math.abs(a) > 0.000001) {
                newVal = b / a;
                newExpr = `(${bExpr}÷${aExpr})`;
                solve([newVal, ...remainingNums], [newExpr, ...remainingExprs]);
              }
              break;
          }
        }
      }
    }
  };
  
  // 初始表达式就是数字本身
  const initExprs = numbers.map(num => num.toString());
  solve(numbers, initExprs);
  
  // 去重并格式化解法
  const uniqueSolutions = [];
  const seen = new Set();
  
  for (const expr of solutions) {
    // 标准化运算符：确保使用统一的乘除符号
    let normalized = expr.replace(/\*/g, '×').replace(/\//g, '÷');
    
    // 验证表达式是否正确计算为24
    try {
      let calcExpression = normalized.replace(/×/g, '*').replace(/÷/g, '/');
      const result = safeEval(calcExpression);
      if (Math.abs(result - 24) < 0.000001) {
        if (!seen.has(normalized)) {
          seen.add(normalized);
          uniqueSolutions.push({ expression: normalized, description: '' });
        }
      }
    } catch (error) {
      // 忽略无效表达式
    }
  }
  
  return uniqueSolutions.slice(0, 10); // 最多返回10种解法
}

// 切换游戏模式
function switchGameMode(element) {
  const mode = element.dataset.mode;
  if (gameData.gameMode === mode) return;
  
  // 更新模式标签
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  element.classList.add('active');
  
  gameData.gameMode = mode;
  gameData.showSolvabilityResult = false;
  gameData.showingHint = false;
  gameData.showingSolution = false;
  
  // 隐藏所有提示和答案
  elements.hintSection.style.display = 'none';
  elements.solutionSection.style.display = 'none';
  
  // 切换到预设模式
  if (mode === 'preset') {
    elements.presetControls.style.display = 'block';
    elements.customControls.style.display = 'none';
    elements.solvabilitySection.style.display = 'none';
    elements.globalControlSection.style.display = 'block';
    elements.statsSection.style.display = 'block';
    elements.controlSection.classList.remove('hidden-control');
    
    // 生成新游戏
    generateNewGame();
    
    // 显示历史记录（如果有）
    if (gameData.gameHistory.length > 0) {
      elements.historySection.style.display = 'block';
      updateHistoryDisplay();
    } else {
      elements.historySection.style.display = 'none';
    }
  } 
  // 切换到自定义模式
  else {
    elements.presetControls.style.display = 'none';
    elements.customControls.style.display = 'block';
    elements.globalControlSection.style.display = 'none';
    elements.statsSection.style.display = 'none';
    elements.historySection.style.display = 'none';
    elements.controlSection.classList.add('hidden-control');
  }
}

// 生成新游戏
function generateNewGame() {
  try {
    // 随机选择一个预设题目
    const randomIndex = Math.floor(Math.random() * gameData.questionBank.length);
    const selectedQuestion = gameData.questionBank[randomIndex];
    
    // 打乱数字顺序
    const shuffledNumbers = [...selectedQuestion.numbers].sort(() => Math.random() - 0.5);
    
    gameData.numbers = shuffledNumbers;
    gameData.expression = '';
    gameData.showResult = false;
    gameData.showingHint = false;
    gameData.showingSolution = false;
    gameData.solutionFound = false;
    gameData.solutions = selectedQuestion.solutions;
    
    // 更新UI
    elements.expressionInput.value = '';
    elements.clearBtn.style.display = 'none';
    elements.checkBtn.disabled = true;
    elements.resultSection.style.display = 'none';
    elements.hintSection.style.display = 'none';
    elements.solutionSection.style.display = 'none';
    
    // 更新数字显示
    updateNumbersDisplay();
    
  } catch (error) {
    console.error('生成新游戏失败', error);
    alert('生成新游戏失败');
  }
}

// 显示提示
function showHint() {
  const randomIndex = Math.floor(Math.random() * gameData.hints.length);
  gameData.showingHint = true;
  gameData.currentHint = gameData.hints[randomIndex];
  
  // 更新UI
  elements.hintText.textContent = gameData.currentHint;
  elements.hintSection.style.display = 'block';
}

// 关闭提示
function closeHint() {
  gameData.showingHint = false;
  elements.hintSection.style.display = 'none';
}

// 显示答案
function showSolution() {
  gameData.showingSolution = true;
  
  // 更新UI
  let solutionsHTML = '';
  gameData.solutions.forEach(solution => {
    solutionsHTML += `<div class="solution-item">
      <span class="solution-expression">${solution.expression} = 24</span>
      <span class="solution-desc">${solution.description}</span>
    </div>`;
  });
  elements.solutionList.innerHTML = solutionsHTML;
  elements.solutionSection.style.display = 'block';
}

// 关闭答案
function closeSolution() {
  gameData.showingSolution = false;
  elements.solutionSection.style.display = 'none';
}

// 阶乘函数
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

// 检验答案
function checkAnswer() {
  const { expression, numbers, solutions } = gameData;
  
  if (!expression) {
    alert('请输入算式');
    return;
  }

  try {
    // 检查是否使用了所有数字
    const usedNumbers = extractNumbersFromExpression(expression);
    const sortedUsed = usedNumbers.sort((a, b) => a - b);
    const sortedOriginal = [...numbers].sort((a, b) => a - b);
    
    if (JSON.stringify(sortedUsed) !== JSON.stringify(sortedOriginal)) {
      showResult(false, '请确保使用了所有4个数字，且每个数字只使用一次');
      return;
    }

    // 替换显示符号为计算符号
    let calcExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    
    // 处理阶乘
    calcExpression = calcExpression.replace(/(\d+)!/g, (match, num) => {
      return factorial(parseInt(num));
    });
    
    // 处理平方根
    calcExpression = calcExpression.replace(/√(\d+)/g, (match, num) => {
      return Math.sqrt(parseInt(num));
    });
    
    // 计算结果
    const result = safeEval(calcExpression);
    
    // 允许一定的误差范围（处理浮点数精度问题）
    if (Math.abs(result - 24) < 0.000001) {
      showResult(true, '恭喜你，答对了！');
      addToHistory(numbers, true);
      updateStats(true);
      gameData.solutionFound = true;
    } else {
      showResult(false, `计算结果：${result}，正确答案是24`);
      addToHistory(numbers, false);
      updateStats(false);
    }
    
  } catch (error) {
    console.error('表达式错误', error);
    showResult(false, '表达式有误，请检查语法');
  }
}

// 从表达式中提取数字
function extractNumbersFromExpression(expr) {
  const matches = expr.match(/\d+/g);
  return matches ? matches.map(n => parseInt(n)) : [];
}

// 显示结果
function showResult(isCorrect, message) {
  gameData.showResult = true;
  gameData.isCorrect = isCorrect;
  gameData.resultMessage = message;
  
  // 更新UI
  elements.resultSection.style.display = 'block';
  elements.resultBox.className = `result-box ${isCorrect ? 'correct' : 'incorrect'}`;
  elements.resultIcon.textContent = isCorrect ? '🎉' : '😅';
  elements.resultMessage.textContent = message;
  
  if (isCorrect) {
    elements.resultExpression.style.display = 'block';
    elements.expressionDisplay.textContent = `${gameData.expression} = 24`;
  } else {
    elements.resultExpression.style.display = 'none';
  }
  
  // 3秒后隐藏结果
  setTimeout(() => {
    elements.resultSection.style.display = 'none';
  }, 3000);
}

// 添加到历史记录
function addToHistory(numbers, solved) {
  const historyItem = {
    numbers: [...numbers],
    solved,
    timestamp: new Date().toLocaleString()
  };
  
  let history = [...gameData.gameHistory];
  history.unshift(historyItem);
  
  // 只保留最近10条记录
  if (history.length > 10) {
    history = history.slice(0, 10);
  }
  
  gameData.gameHistory = history;
  
  // 更新历史记录显示
  if (gameData.gameMode === 'preset') {
    elements.historySection.style.display = 'block';
    updateHistoryDisplay();
  }
}

// 更新历史记录显示
function updateHistoryDisplay() {
  let historyHTML = '';
  gameData.gameHistory.forEach(item => {
    let numbersHTML = '';
    item.numbers.forEach(num => {
      numbersHTML += `<span class="history-number">${num}</span>`;
    });
    historyHTML += `<div class="history-item">
      <div class="history-numbers">${numbersHTML}</div>
      <div class="history-result ${item.solved ? 'solved' : 'unsolved'}">
        ${item.solved ? '✓ 已解' : '✗ 未解'}
      </div>
    </div>`;
  });
  elements.historyList.innerHTML = historyHTML;
}

// 更新统计信息
function updateStats(correct) {
  const gamesPlayed = gameData.gamesPlayed + 1;
  const correctAnswers = correct ? gameData.correctAnswers + 1 : gameData.correctAnswers;
  const accuracy = Math.round((correctAnswers / gamesPlayed) * 100);
  
  gameData.gamesPlayed = gamesPlayed;
  gameData.correctAnswers = correctAnswers;
  gameData.accuracy = accuracy;
  
  // 更新UI
  elements.gamesPlayed.textContent = gamesPlayed;
  elements.correctAnswers.textContent = correctAnswers;
  elements.accuracy.textContent = `${accuracy}%`;
  
  // 保存到本地存储
  try {
    localStorage.setItem('24point_stats', JSON.stringify({
      gamesPlayed,
      correctAnswers,
      accuracy,
      gameHistory: gameData.gameHistory
    }));
  } catch (error) {
    console.warn('本地存储不可用，无法保存统计数据', error);
  }
}

// 加载统计数据
function loadStats() {
  try {
    const stats = localStorage.getItem('24point_stats');
    if (stats) {
      const parsedStats = JSON.parse(stats);
      gameData.gamesPlayed = parsedStats.gamesPlayed || 0;
      gameData.correctAnswers = parsedStats.correctAnswers || 0;
      gameData.accuracy = parsedStats.accuracy || 0;
      gameData.gameHistory = parsedStats.gameHistory || [];
      
      // 更新UI
      elements.gamesPlayed.textContent = gameData.gamesPlayed;
      elements.correctAnswers.textContent = gameData.correctAnswers;
      elements.accuracy.textContent = `${gameData.accuracy}%`;
    }
  } catch (error) {
    console.error('加载统计数据失败', error);
  }
}

// 页面加载时执行
window.onload = function() {
  // 加载统计数据
  loadStats();
  
  // 初始化游戏
  if (gameData.gameMode === 'preset') {
    // 显示预设模式的控件
    elements.presetControls.style.display = 'block';
    elements.customControls.style.display = 'none';
    elements.solvabilitySection.style.display = 'none';
    elements.globalControlSection.style.display = 'block';
    elements.statsSection.style.display = 'block';
    elements.controlSection.classList.remove('hidden-control');
    
    // 生成新游戏
    generateNewGame();
    
    // 显示历史记录（如果有）
    if (gameData.gameHistory.length > 0) {
      elements.historySection.style.display = 'block';
      updateHistoryDisplay();
    } else {
      elements.historySection.style.display = 'none';
    }
  }
};
