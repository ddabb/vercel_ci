// api/guessnum.js
export default async function handler(req, res) {
    let secretNumber;
    let gameActive = false;

    if (req.method === 'POST' && req.url === '/reset-game') {
        secretNumber = Math.floor(Math.random() * 100) + 1;
        gameActive = true;
        return res.status(200).json({ message: '游戏已重置' });
    }

    if (req.method === 'POST' && req.url === '/check-guess') {
        if (!gameActive) {
            return res.status(400).json({ message: '游戏未激活' });
        }

        const { guess } = req.body;

        if (isNaN(guess)) {
            return res.status(400).json({ message: '请输入一个有效的数字' });
        }

        const guessNumber = parseInt(guess, 10);

        if (guessNumber === secretNumber) {
            res.status(200).json({ message: '恭喜你，猜对了！' });
            gameActive = false;
        } else if (guessNumber < secretNumber) {
            res.status(200).json({ message: '太低了，再试一次！' });
        } else {
            res.status(200).json({ message: '太高了，再试一次！' });
        }
    } else {
        res.status(404).json({ message: '未找到请求的路径' });
    }
}