let game = {
    active: false,
    secretNumber: null,
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        if (req.body.action === 'reset-game') {
            game.secretNumber = Math.floor(Math.random() * 100) + 1;
            game.active = true;
            return res.status(200).json({ message: '游戏已重置', active: game.active });
        }

        if (req.body.action === 'check-guess') {
            if (!game.active) {
                return res.status(400).json({ message: '游戏未激活' });
            }

            const { guess } = req.body;

            if (isNaN(guess)) {
                return res.status(400).json({ message: '请输入一个有效的数字' });
            }

            const guessNumber = parseInt(guess, 10);

            if (guessNumber === game.secretNumber) {
                game.active = false;
                res.status(200).json({ message: '恭喜你，猜对了！', active: game.active });
            } else if (guessNumber < game.secretNumber) {
                res.status(200).json({ message: '太低了，再试一次！', active: game.active });
            } else {
                res.status(200).json({ message: '太高了，再试一次！', active: game.active });
            }
        }
    } else {
        res.status(405).json({ message: '方法不允许' });
    }
}