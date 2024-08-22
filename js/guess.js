async function resetGame() {
    try {
        const response = await fetch('/api/guessnum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'reset-game' })
        });
        const data = await response.json();
        console.log(data.message);
        updateUI(data.active);
    } catch (error) {
        console.error('重置游戏失败:', error);
    }
}

async function checkGuess() {
    const guess = document.getElementById('guess').value;

    try {
        const response = await fetch('/api/guessnum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'check-guess', guess })
        });
        const data = await response.json();
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = data.message;
        resultDiv.style.color = data.message.includes('猜对了') ? 'green' : 'red';

        updateUI(data.active);
    } catch (error) {
        console.error('检查猜测失败:', error);
    }
}

function updateUI(isActive) {
    if (!isActive) {
        document.getElementById('resetButton').style.display = 'inline-block';
    } else {
        document.getElementById('resetButton').style.display = 'none';
    }
}

// 初始化游戏
resetGame();