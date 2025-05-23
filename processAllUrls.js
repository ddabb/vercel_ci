const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processAllUrls() {
    try {
        // 读取wechat.json文件以获取总数
        const jsonPath = path.join(__dirname, 'jsons', 'wechat.json');
        const data = await fs.readFile(jsonPath, 'utf8');
        const wechatData = JSON.parse(data);
        const totalUrls = wechatData.length;

        // 从索引4开始处理（因为我们已经处理了0-3）
        for (let i = 4; i < totalUrls; i++) {
            console.log(`\n开始处理索引 ${i}...`);
            
            // 使用Promise包装exec调用
            await new Promise((resolve, reject) => {
                exec(`node processOneUrl.js ${i}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`处理索引 ${i} 时出错:`, error);
                        reject(error);
                        return;
                    }
                    console.log(stdout);
                    if (stderr) console.error(stderr);
                    resolve();
                });
            });

            // 随机延时3-6秒
            const delay = 3000 + Math.floor(Math.random() * 3000);
            console.log(`等待 ${delay/1000} 秒后继续...\n`);
            await sleep(delay);
        }

        console.log('所有URL处理完成！');

    } catch (error) {
        console.error('处理过程中出错:', error);
    }
}

// 运行脚本
processAllUrls();