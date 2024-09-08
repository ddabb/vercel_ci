// 导出DanceLinks类
export class DanceLinks {
    constructor(size) {
        this.headers = new Array(size);
        this.root = new ColumnHeader(-1, -1); // 根节点的 size 应该是 -1
        this.root.left = this.root;
        this.root.right = this.root;

        for (let i = 0; i < size; i++) {
            this.headers[i] = new ColumnHeader(i, 0);
            this.headers[i].left = this.headers[i];
            this.headers[i].right = this.headers[i];
            this.linkColumns(this.root, this.headers[i]);
        }
    }


    linkColumns(root, header) {
        header.right = root.right;
        header.left = root;
        root.right.left = header;
        root.right = header;
    }

    linkNodes(nodeA, nodeB) {
        nodeA.right = nodeB;
        nodeB.left = nodeA;
        nodeB.up = nodeA;
        nodeA.down = nodeB;
    }

    addSolutionRow(row) {
        let node = new Node(this.headers[0], row);
        let header = this.headers[0];
        for (let i = 1; i < this.headers.length; i++) {
            if (row & (1 << i)) {
                let newNode = new Node(header, row); // 应该传递正确的列头
                this.linkNodes(node, newNode);
                node = newNode;
                header = this.headers[i];
            }
        }
        this.linkNodes(node, new Node(header, row));
    }


    cover(columnHeader) {
        columnHeader.covered = true;
        columnHeader.right.left = columnHeader.left;
        columnHeader.left.right = columnHeader.right;
        let node = columnHeader.down;
        while (node !== columnHeader) {
            let n = node.right;
            while (n !== node) {
                n.up.down = n.down;
                n.down.up = n.up;
                n = n.right;
            }
            node = node.down;
        }
    }

    uncover(columnHeader) {
        columnHeader.covered = false;
        let node = columnHeader.up;
        while (node !== columnHeader) {
            let n = node.left;
            while (n !== node) {
                n.up.down = n;
                n.down.up = n;
                n = n.left;
            }
            node = node.up;
        }
        columnHeader.right.left = columnHeader;
        columnHeader.left.right = columnHeader;
    }

    selectColumn() {
        let minCol = null;
        for (let header of this.headers) {
            if (!header.covered && (minCol === null || header.size < minCol.size)) {
                minCol = header;
            }
        }
        return minCol;
    }

    search(solutions, solution) {
        if (this.selectColumn() === null) {
            solutions.push(solution.slice());
            return;
        }
        let column = this.selectColumn();
        this.cover(column);
        for (let row = column.down; row !== column; row = row.down) {
            solution.push(row.row);
            let node = row.right;
            while (node !== row) {
                this.cover(node.column);
                node = node.right;
            }
            this.search(solutions, solution);
            solution.pop();
            node = row.left;
            while (node !== row) {
                this.uncover(node.column);
                node = node.left;
            }
        }
        this.uncover(column);
    }
}

// Node类
export class Node {
    constructor(column, row) {
        this.column = column;
        this.row = row;
        this.right = null;
        this.left = null;
        this.up = null;
        this.down = null;
    }
}

// ColumnHeader类
export class ColumnHeader extends Node {
    constructor(index, size) {
        super(null, null);
        this.index = index;
        this.size = size;
        this.covered = false;
    }
}

// 数独求解器
export class SudokuSolver {
    static checkValid(board) {
        const size = 81 * 9;
        const dlx = new DanceLinks(size);

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        let bitMask = 1 << (col + (row * 9) + ((num - 1) * 81));
                        dlx.addSolutionRow(bitMask);
                    }
                } else {
                    let bitMask = 1 << (col + (row * 9) + ((board[row][col] - 1) * 81));
                    dlx.addSolutionRow(bitMask);
                }
            }
        }

        let solutions = [];
        dlx.search(solutions, []);

        return {
            hasSolution: solutions.length > 0,
            numberOfSolutions: solutions.length
        };
    }

    static solve(board) {
        const result = SudokuSolver.checkValid(board);
        if (!result.hasSolution || result.numberOfSolutions !== 1) {
            return null;
        }

        const size = 81 * 9;
        const dlx = new DanceLinks(size);

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        let bitMask = 1 << (col + (row * 9) + ((num - 1) * 81));
                        dlx.addSolutionRow(bitMask);
                    }
                } else {
                    let bitMask = 1 << (col + (row * 9) + ((board[row][col] - 1) * 81));
                    dlx.addSolutionRow(bitMask);
                }
            }
        }

        let solutions = [];
        dlx.search(solutions, []);
        let solution = solutions[0];

        let solvedBoard = board.map(row => row.slice());
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (solvedBoard[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        let bitMask = 1 << (col + (row * 9) + ((num - 1) * 81));
                        if ((solution & bitMask) !== 0) {
                            solvedBoard[row][col] = num;
                            break;
                        }
                    }
                }
            }
        }

        return solvedBoard;
    }
}