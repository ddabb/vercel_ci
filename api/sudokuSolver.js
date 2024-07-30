class Node {
    constructor() {
        this.row = null;
        this.column = null;
        this.up = null;
        this.down = null;
        this.left = null;
        this.right = null;
    }
}

class DanceLink {
    constructor() {
        this.RR = 729;
        this.CC = 324;
        this.INF = 1000000000;
        this.mem = new Array(this.RR + 9).fill(0);
        this.ans = new Array(this.RR + 9).fill(0);
        this.ch = new Array(this.RR + 9);
        this.cnt = new Array(this.CC + 9).fill(0);

        this.head = new Node();
        this.head.column = -1;
        this.head.row = -1;
        this.head.left = this.head;
        this.head.right = this.head;
        this.head.up = this.head;
        this.head.down = this.head;

        this.col = new Array(this.CC);
        for (let i = 0; i < this.CC; i++) {
            this.col[i] = new Node();
            this.col[i].column = i;
            this.col[i].row = this.RR;
            this.col[i].up = this.col[i];
            this.col[i].down = this.col[i];
            this.col[i].left = this.head;
            this.col[i].right = this.head.right;
            this.col[i].left.right = this.col[i];
            this.col[i].right.left = this.col[i];
        }

        this.row = new Array(this.RR);
        for (let i = 0; i < this.RR; i++) {
            this.row[i] = new Node();
            this.row[i].row = i;
            this.row[i].column = this.CC;
            this.row[i].left = this.row[i];
            this.row[i].right = this.row[i];
            this.row[i].up = this.head;
            this.row[i].down = this.head.down;
            this.row[i].up.down = this.row[i];
            this.row[i].down.up = this.row[i];
        }

        // Initialize all links between nodes
        for (let i = 0; i < this.RR; i++) this.row[i].left.right = this.row[i].right;

        this.all = new Array(this.RR * this.CC + 99).fill(new Node());
        this.all_t = 1;

        this.chk_unique = false;
        this.scount = 0;
        this.chkVaild = false;
    }

    link(r, c) {
        this.cnt[c]++;
        const t = this.all[this.all_t];
        t.row = r;
        t.column = c;
        t.left = this.row[r];
        t.right = this.row[r].right;
        t.left.right = t;
        t.right.left = t;
        t.up = this.col[c];
        t.down = this.col[c].down;
        t.up.down = t;
        t.down.up = t;
        this.all_t++;
    }

    remove(c) {
        const t = this.col[c];
        t.right.left = t.left;
        t.left.right = t.right;
        for (let t = this.col[c].down; t !== this.col[c]; t = t.down) {
            for (let tt = t.right; tt !== t; tt = tt.right) {
                this.cnt[tt.column]--;
                tt.up.down = tt.down;
                tt.down.up = tt.up;
            }
        }
    }

    resume(c) {
        const t = this.col[c];
        for (let t = this.col[c].down; t !== this.col[c]; t = t.down) {
            for (let tt = t.left; tt !== t; tt = tt.left) {
                this.cnt[tt.column]++;
                tt.down.up = tt;
                tt.up.down = tt;
            }
        }
        t.left.right = t;
        t.right.left = t;
    }

    getAllCount(k) {
        if (this.head.right === this.head) return 1;
        let t, tt;
        let min = this.INF, tc = 0;
        for (t = this.head.right; t !== this.head; t = t.right)
            if (this.cnt[t.column] < min) { min = this.cnt[t.column]; tc = t.column; if (min <= 1) break; }
        this.remove(tc);
        let scnt = 0;
        for (t = this.col[tc].down; t !== this.col[tc]; t = t.down) {
            this.mem[k] = t.row;
            for (tt = t.right; tt !== t; tt = tt.right) this.remove(tt.column);
            scnt += this.getAllCount(k + 1);
            if (!this.chk_unique && scnt === 1) return scnt;
            if (this.chkVaild && scnt > 1) return scnt;
            for (tt = t.left; tt !== t; tt = tt.left) this.resume(tt.column);
        }
        this.resume(tc);
        return scnt;
    }

    solve(k) {
        if (this.head.right === this.head) return 1;
        let t, tt;
        let min = this.INF, tc = 0;
        for (t = this.head.right; t !== this.head; t = t.right)
            if (this.cnt[t.column] < min) { min = this.cnt[t.column]; tc = t.column; if (min <= 1) break; }
        this.remove(tc);
        let scnt = 0;
        for (t = this.col[tc].down; t !== this.col[tc]; t = t.down) {
            this.mem[k] = t.row;
            for (tt = t.right; tt !== t; tt = tt.right) this.remove(tt.column);
            scnt += this.solve(k + 1);
            if (!this.chk_unique && scnt === 1) return scnt;
            if (scnt > 1) return scnt;
            for (tt = t.left; tt !== t; tt = tt.left) this.resume(tt.column);
        }
        this.resume(tc);
        return scnt;
    }

    solution_count(str) {
        this.chk_unique = true;
        this.runAll(str);
        return this.scount;
    }

    isValid(str) {
        this.chkVaild = true;
        return this.solve(1) !== 0;
    }

    getOneAnswer(str) {
        this.chk_unique = false;
        return this.run(str);
    }

    doSolve(str) {
        if (this.isValid(str)) {
          this.chk_unique = false;
          return this.run(str);
        }
        return null;
      }

    run(str) {
        this.mem.fill(0);
        this.ans.fill(0);
        this.ch = str.replace(/\r/g, '').replace(/\n/g, '').split('');
        this.cnt.fill(0);
        this.head.left = this.head;
        this.head.right = this.head;
        this.head.up = this.head;
        this.head.down = this.head;
        for (let i = 0; i < this.CC; i++) {
            this.col[i] = new Node();
            this.col[i].column = i;
            this.col[i].row = this.RR;
            this.col[i].up = this.col[i];
            this.col[i].down = this.col[i];
            this.col[i].left = this.head;
            this.col[i].right = this.head.right;
            this.col[i].left.right = this.col[i];
            this.col[i].right.left = this.col[i];
        }
        for (let i = 0; i < this.RR; i++) {
            this.row[i] = new Node();
            this.row[i].row = i;
            this.row[i].column = this.CC;
            this.row[i].left = this.row[i];
            this.row[i].right = this.row[i];
            this.row[i].up = this.head;
            this.row[i].down = this.head.down;
            this.row[i].up.down = this.row[i];
            this.row[i].down.up = this.row[i];
        }
        for (let i = 0; i < this.RR; i++) {
            const r = Math.floor(i / 9 / 9) % 9;
            const c = Math.floor(i / 9) % 9;
            const val = i % 9 + 1;
            if (this.ch[r * 9 + c] === '.' || this.ch[r * 9 + c] === '0' || this.ch[r * 9 + c] === (val + '0')) {
                this.link(i, r * 9 + val - 1);
                this.link(i, 81 + c * 9 + val - 1);
                const tr = Math.floor(r / 3);
                const tc = Math.floor(c / 3);
                this.link(i, 162 + (tr * 3 + tc) * 9 + val - 1);
                this.link(i, 243 + r * 9 + c);
            }
        }
        for (let i = 0; i < this.RR; i++) this.row[i].left.right = this.row[i].right;
        this.scount = this.solve(1);
        for (let i = 1; i <= 81; i++) {
            const t = Math.floor(this.mem[i] / 9) % 81;
            const val = this.mem[i] % 9 + 1;
            this.ans[t] = val;
        }
        let sb = '';
        for (let i = 0; i < 81; i++) sb += this.ans[i];
        return sb;
    }

    runAll(str) {
        this.mem.fill(0);
        this.ans.fill(0);
        this.ch = str.replace(/\r/g, '').replace(/\n/g, '').split('');
        this.cnt.fill(0);
        this.head.left = this.head;
        this.head.right = this.head;
        this.head.up = this.head;
        this.head.down = this.head;
        for (let i = 0; i < this.CC; i++) {
            this.col[i] = new Node();
            this.col[i].column = i;
            this.col[i].row = this.RR;
            this.col[i].up = this.col[i];
            this.col[i].down = this.col[i];
            this.col[i].left = this.head;
            this.col[i].right = this.head.right;
            this.col[i].left.right = this.col[i];
            this.col[i].right.left = this.col[i];
        }
        for (let i = 0; i < this.RR; i++) {
            this.row[i] = new Node();
            this.row[i].row = i;
            this.row[i].column = this.CC;
            this.row[i].left = this.row[i];
            this.row[i].right = this.row[i];
            this.row[i].up = this.head;
            this.row[i].down = this.head.down;
            this.row[i].up.down = this.row[i];
            this.row[i].down.up = this.row[i];
        }
        for (let i = 0; i < this.RR; i++) {
            const r = Math.floor(i / 9 / 9) % 9;
            const c = Math.floor(i / 9) % 9;
            const val = i % 9 + 1;
            if (this.ch[r * 9 + c] === '.' || this.ch[r * 9 + c] === '0' || this.ch[r * 9 + c] === (val + '0')) {
                this.link(i, r * 9 + val - 1);
                this.link(i, 81 + c * 9 + val - 1);
                const tr = Math.floor(r / 3);
                const tc = Math.floor(c / 3);
                this.link(i, 162 + (tr * 3 + tc) * 9 + val - 1);
                this.link(i, 243 + r * 9 + c);
            }
        }
        for (let i = 0; i < this.RR; i++) this.row[i].left.right = this.row[i].right;
        this.scount = this.getAllCount(1);
        for (let i = 1; i <= 81; i++) {
            const t = Math.floor(this.mem[i] / 9) % 81;
            const val = this.mem[i] % 9 + 1;
            this.ans[t] = val;
        }
        let sb = '';
        for (let i = 0; i < 81; i++) sb += this.ans[i];
        return sb;
    }
}

module.exports = { DanceLink };