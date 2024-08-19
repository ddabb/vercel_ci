let secretNumber;
let isGameActive = false;

function resetGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    document.getElementById('guess').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('resetButton').style.display = 'none';
    isGameActive = true;
}

function checkGuess() {
    if (!isGameActive) return;

    const guess = parseInt(document.getElementById('guess').value, 10);
    const resultDiv = document.getElementById('result');

    if (guess == secretNumber) {
        resultDiv.textContent = '恭喜你，猜对了！';
        resultDiv.style.color = 'green';
        document.getElementById('resetButton').style.display = 'inline-block';
        isGameActive = false;
    } else if (guess < secretNumber) {
        resultDiv.textContent = '太低了，再试一次！';
        resultDiv.style.color = 'red';
    } else {
        resultDiv.textContent = '太高了，再试一次！';
        resultDiv.style.color = 'red';
    }
}

// 初始化游戏
resetGame();