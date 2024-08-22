let isGameActive = false;

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
        isGameActive = data.active;
        updateUI(isGameActive);
        clearInput();
    } catch (error) {
        console.error('重置游戏失败:', error);
    }
}

async function checkGuess() {
    if (!isGameActive) return;

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

        isGameActive = data.active;
        updateUI(isGameActive);
    } catch (error) {
        console.error('检查猜测失败:', error);
    }
}

function updateUI(isActive) {
    const resetButton = document.getElementById('resetButton');
    if (!isActive) {
        resetButton.style.display = 'inline-block';
    } else {
        resetButton.style.display = 'none';
    }
}

function clearInput() {
    document.getElementById('guess').value = '';
}

// 初始化游戏
resetGame();