// game.js
// Assuming the following modules are defined elsewhere in your project
import Board from "./grid.js";
import Main from "./main.js";
import Util from "../../util.js";

// Since there is no equivalent of `getApp()` in web apps, you need to define `app` differently.
// For simplicity, we will assume `app` is an object that holds global data.
const app = {
    globalData: {
        showView: true,
        userInfo: {
            pscore: 0,
            psharp: []
        }
    }
};

// Assuming `Page` is a placeholder for initializing components in web apps,
// we will convert it into a class-based component or a functional component depending on your framework.
// For this example, we will use a simple object to encapsulate our game logic.

const GamePage = {
    data: {
        hidden: false,
        start: "开始",
        num: [], // 2D square array
        score: 0,
        bestScore: 0, // Highest score
        endMsg: '',
        cacheGrid: null, // Cache information
        showArea: true,
        showForm: false,
        letters1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        letters2: ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',],
        letters3: ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
        scene: "",
        empty: '\t',
        newLine: '\n',
        showFont: false,
        over: false // Game over flag
    },

    initMethod: function () {
        if (app.globalData.userInfo && app.globalData.userInfo.pscore) {
            this.setData({
                bestScore: app.globalData.userInfo.pscore,
                showFont: app.globalData.userInfo.pscore > 0
            });
        }
        this.gameStart();
        if (app.globalData.userInfo && app.globalData.userInfo.psharp) {
            this.setData({
                start: "重玩",
                hidden: true,
            });
            this.data.main.board.grid = app.globalData.userInfo.psharp;
            this.updateView(app.globalData.userInfo.psharp);
        }
    },
    updateView(data) {
        var max = 0;

        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++) {
                if (data[i][j] != "") {
                    max += this.GetCellScore(data[i][j]);
                }
            }
        this.setData({
            num: data,
            score: max
        });
        if (max > this.data.bestScore) {
            this.setData({
                endMsg: '创造新纪录！',
                bestScore: max,
                showFont: max > 1000
            });
        }
    }, 
    GetCellScore: function (value) {
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

        var index = letters.indexOf(value);
        return 3 * (2 ** index);
    },
    gameStart: function () { // Game start
        this.updateDbScore();
        var main = new Main(4);
        this.setData({
            endMsg: '',
            main: main
        });
        this.data.main.__proto__ = main.__proto__;

        this.setData({
            hidden: true,
            over: false,
            score: 0,
            num: this.data.main.board.grid
        });
    },

    gameOver: function () { // Game over
        this.setData({
            over: true
        });

        if (this.data.score > this.data.bestScore) {
            this.setData({
                endMsg: '创造新纪录！',
                bestScore: this.data.score
            });
            wx.setStorageSync('highScore', this.data.score);
        } else {
            this.updateDbScore(); //游戏结束，保存历史最高分
            this.setData({
                start: "开始",
                endMsg: '游戏结束！'
            });
        }
    },

    // Event handlers for touch/mouse events
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,

    touchStart: function (ev) { // Touch start coordinates
        if (this.clickReDoOnce) {
            this.setData({
                start: "重置"
            });
            this.clickReDoOnce = false;
        } {
            let cacheGrid = this.data.main.board.grid;
            this.setData({
                start: "重置",
                cacheGrid: cacheGrid
            });
        }

        var touch = ev.touches[0];
        this.touchStartX = touch.clientX;
        console.log("  this.touchStartX" + this.touchStartX)
        this.touchStartY = touch.clientY;
        console.log("  this.touchStartY" + this.touchStartY)
    },

    touchEnd: function (ev) {
        var touch = ev.changedTouches[0];
        this.touchEndX = touch.clientX;
        console.log("  this.touchEndX" + this.touchEndX)
        this.touchEndY = touch.clientY;
        console.log("  this.touchEndY" + this.touchEndY)
        console.log("touchEnd")
        var disX = this.touchStartX - this.touchEndX;
        var absdisX = Math.abs(disX);
        console.log(" disX" + disX)
        var disY = this.touchStartY - this.touchEndY;
        var absdisY = Math.abs(disY);
        console.log(" disY" + disY)
        if (this.data.main.isOver()) { // 游戏是否结束
            this.gameOver();
        } else {
            let dis = Math.max(absdisX, absdisY);
            console.log("dis" + dis)
            if (dis > 3) { // 减少触屏失效的错句
                var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0); // 确定移动方向

                var data = this.data.main.move(direction);
                this.updateView(data);
                app.globalData.userInfo.psharp = this.data.main.board.grid; //保存最新的棋盘信息
            }
        }
    },

    // Other methods like updateDbScore, save, updateView, etc.
    // ...

    // Method to mimic setData behavior in web apps
    setData: function (data) {
        Object.assign(this.data, data);
        // Call a render function or trigger a re-render in a framework like React
        this.render();
    },

    // A render function or method to update the UI based on the data
    render: function () {
        // Implement rendering logic here
        // ...
    }
};

// Assuming you have a DOM element where the game is rendered
const gameContainer = document.getElementById('game-container');

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    GamePage.initMethod();
    // Bind touch events to the game container
    gameContainer.addEventListener('touchstart', GamePage.touchStart);
    gameContainer.addEventListener('touchend', GamePage.touchEnd);
});