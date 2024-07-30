const { DanceLink } = require('./sudokuSolver');

// 创建DanceLink实例
const dl = new DanceLink();

// 定义测试用的Sudoku谜题
const sudokuPuzzle = "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79";

// 检查谜题是否有效
console.log("Is valid:", dl.isValid(sudokuPuzzle));

// 获取解的数量
console.log("Solution count:", dl.solution_count(sudokuPuzzle));

// 获取一个解
console.log("Get one answer:", dl.getOneAnswer(sudokuPuzzle));

// 解决谜题（如果有效）
const solved = dl.doSolve(sudokuPuzzle);
console.log("Solved:", solved);