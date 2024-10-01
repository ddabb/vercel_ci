(function () {
    var wrapper = document.getElementsByClassName('wrapper')[0];
    var remain = document.getElementsByClassName('remain')[0];
    var startBtn = document.getElementsByClassName('start-btn')[0];
    var winBtn = document.getElementsByClassName('win')[0];
    var loseBtn = document.getElementsByClassName('lose')[0];
    var levelBtn = document.getElementsByClassName('level')[0];
    var resetBtn = document.getElementsByClassName('reset')[0];
    var timeBox = document.getElementsByClassName('time')[0];
    var timer = null;
    var box = null;
    var active = document.getElementsByClassName('active')[0];
    var mines,
        Index,
        key = true; // 控制游戏开始后是否还能点击开始按钮
    var levelIndex = 'easy'; // 难度选择

    levelBtn.onclick = function (e) {
        e = e || window.event;
        target = e.target || e.srcElement;
        if (target.tagName == "LI") {
            if (key) {
                active.classList.remove('active');
                target.classList.add('active');
                active = target;
                if (target.classList.contains('easy')) {
                    levelIndex = 'easy';
                } else if (target.classList.contains('normal')) {
                    levelIndex = 'normal';
                } else if (target.classList.contains('hard')) {
                    levelIndex = 'hard';
                }
            }
        }
    }

    startBtn.onclick = startGame;

    resetBtn.addEventListener('mousedown', function () {
        this.style.transform = "scale(0.8)";
    }, false);

    resetBtn.addEventListener('mouseup', function () {
        this.style.transform = "scale(1)";
        restart();
    }, false);

    function startGame() {
        if (key) {
            init();
            createTimer(timeBox);
            key = false;
        }
    }

    function init() {
        switch (levelIndex) {
            case 'easy':
                this.tabRowN = 10;
                this.tabColN = 10;
                this.mineN = 10;
                break;
            case 'normal':
                this.tabRowN = 16;
                this.tabColN = 16;
                this.mineN = 40;
                break;
            case 'hard':
                this.tabRowN = 16;
                this.tabColN = 30;
                this.mineN = 99;
                break;
        }
        this.flagN = 0;
        Index = mineN;
        mines = createMines();
        createMap();
    }

    function createMap() {
        box = document.createElement('div');
        for (var i = 0; i < this.tabRowN; i++) {
            for (var j = 0; j < this.tabColN; j++) {
                var tab = document.createElement('div');
                tab.className = 'tab';
                tab.setAttribute('id', i + '-' + j);
                for (var prop in mines) {
                    if (prop == i + '-' + j) {
                        tab.classList.add('bomb');
                    }
                }
                box.appendChild(tab);
            }
        }
        wrapper.style.width = this.tabColN * 35 + 'px';
        wrapper.style.height = this.tabRowN * 35 + 'px';
        wrapper.appendChild(box);
        remain.innerText = this.mineN;
        box.oncontextmenu = function () {
            return false;
        }
        box.onmousedown = function (e) {
            var e = e || window.event;
            var target = e.target || e.srcElement;
            if (e.which == 1) {
                leftClick(target);
            } else if (e.which == 3) {
                rightClick(target);
            }
        }
    }

    function createMines() {
        var mines = {};
        for (var i = 0; i < mineN;) {
            var r = Math.floor(Math.random() * this.tabRowN);
            var c = Math.floor(Math.random() * this.tabColN);
            var num = r + '-' + c;
            if (!mines[num]) {
                mines[num] = 'bomb';
                i++;
            }
        }
        return mines;
    }

    function leftClick(target) {
        if (target.classList.contains('flag')) return;
        target.classList.add('lock');
        if (target.classList.contains('bomb')) {
            target.classList.add('show');
            gameOver();
        } else {
            var rc = target.getAttribute('id').split('-');
            var r, c, num = 0;
            r = +rc[0];
            c = +rc[1];
            for (var i = r - 1; i <= r + 1; i++) {
                for (var j = c - 1; j <= c + 1; j++) {
                    if (i == r && j == c) continue;
                    var dom = document.getElementById(i + '-' + j);
                    if (dom && dom.classList.contains('bomb')) {
                        num++;
                    }
                }
            }
            target.style.backgroundColor = "white";
            if (num) {
                target.innerText = num;
            } else {
                for (var i = r - 1; i <= r + 1; i++) {
                    for (var j = c - 1; j <= c + 1; j++) {
                        var aroundBox = document.getElementById(i + '-' + j);
                        if (aroundBox) {
                            if (!aroundBox.classList.contains('check')) {
                                aroundBox.classList.add('check');
                                leftClick(aroundBox);
                            }
                        }
                    }
                }
            }
        }
    }

    function rightClick(target) {
        if (!target.classList.contains('lock')) {
            if (this.flagN == this.Index && !target.classList.contains('flag')) {
                return;
            } else {
                target.classList.toggle('flag');
            }
            if (target.classList.contains('flag')) {
                if (target.classList.contains('bomb')) {
                    this.mineN--;
                    if (mineN == 0) {
                        youWin();
                    }
                }
                remain.innerText--;
                this.flagN++;
            } else if (!target.classList.contains('flag')) {
                if (target.classList.contains('bomb')) {
                    this.mineN++;
                }
                remain.innerText++;
                this.flagN--;
            }
        }
    }

    function showAll() {
        var len = box.children.length;
        for (var i = 0; i < len; i++) {
            if (box.children[i].classList.contains('bomb')) {
                box.children[i].classList.add('show');
            }
        }
    }

    function youWin() {
        winBtn.parentNode.style.display = 'block';
        clearTimer();
        winBtn.onclick = function () {
            this.parentNode.style.display = 'none';
            clearMap();
            winBtn.onclick = false;
        }
    }

    function gameOver() {
        showAll();
        clearTimer();
        loseBtn.onclick = function () {
            this.parentNode.style.display = 'none';
            clearMap();
            loseBtn.onclick = false;
        }
        setTimeout(function () {
            loseBtn.parentNode.style.display = 'block';
        }, 500)
    }

    function clearMap() {
        if (wrapper.children[0]) {
            wrapper.removeChild(box);
        }
        key = true;
    }

    function restart() {
        clearMap();
        clearTimer();
        timeBox.innerHTML = "00:00";
        key = true;
    }

    function createTimer(dom) {
        clearInterval(timer);
        dom.innerHTML = '00:00';
        var s = 0;
        var m = 0;
        var seconds = 0;
        var minutes = 0;
        timer = setInterval(function () {
            s++;
            seconds = s > 9 ? (s < 60 ? s : '00') : '0' + s;
            if (s > 59) {
                m++;
                s = 0;
            }
            minutes = m < 10 ? '0' + m : m;
            dom.innerHTML = minutes + ":" + seconds;
        }, 1000)
    }

    function clearTimer() {
        clearInterval(timer);
    }

})();