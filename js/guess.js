let isGameActive = false;

async function resetGame() {
    try {
        const response = await fetch('/api/guessnum/reset-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data.message);
        isGameActive = true;
    } catch (error) {
        console.error('重置游戏失败:', error);
    }
}

async function checkGuess() {
    if (!isGameActive) return;

    const guess = document.getElementById('guess').value;

    try {
        const response = await fetch('/api/guessnum/check-greak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guess })
        });
        const data = await response.json();
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = data.message;
        resultDiv.style.color = data.message.includes('猜对了') ? 'green' : 'red';

        if (data.message.includes('猜对了')) {
            document.getElementById('resetButton').style.display = 'inline-block';
            isGameActive = false;
        }
    } catch (error) {
        console.error('检查猜测失败:', error);
    }
}

// 初始化游戏
resetGame();