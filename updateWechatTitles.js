const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                },
                timeout: 15000
            });
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error.message);
            if (i === maxRetries - 1) throw error;
            // 在重试之前等待时间递增
            await sleep(2000 * (i + 1));
        }
    }
}

async function fetchAndExtractBookName(url) {
    try {
        const response = await fetchWithRetry(url);
        const $ = cheerio.load(response.data);
        
        // 获取所有book-name元素的文本
        const bookNames = $('.book-name').map((_, el) => {
            const text = $(el).text().trim();
            // 提取第一个故事标题
            const match = text.match(/故事《([^》]+)》/);
            return match ? match[1] : null;
        }).get();

        // 过滤掉空值并去重
        const uniqueBookNames = [...new Set(bookNames.filter(name => name))];
        
        if (uniqueBookNames.length > 0) {
            // 返回第一个标题
            const title = `故事《${uniqueBookNames[0]}》`;
            console.log('提取到的标题:', title);
            return title;
        }

        console.log('未找到有效的标题');
        return null;
    } catch (error) {
        console.error(`Error fetching ${url}:`);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else {
            console.error('Error details:', error.message);
        }
        return null;
    }
}

async function updateWechatTitles() {
    try {
        // 读取wechat.json文件
        const jsonPath = path.join(__dirname, 'jsons', 'wechat.json');
        const data = await fs.readFile(jsonPath, 'utf8');
        const wechatData = JSON.parse(data);

        // 处理每个条目
        console.log('开始处理URL...');
        
        let successCount = 0;
        let failCount = 0;
        
        // 处理所有URL
        for (let i = 0; i < wechatData.length; i++) {
            const item = wechatData[i];
            console.log(`\n处理 ${i + 1}/${wechatData.length}: ${item.url}`);
            
            try {
                const bookName = await fetchAndExtractBookName(item.url);
                if (bookName) {
                    console.log(`原标题: ${item.title}`);
                    console.log(`新标题: ${bookName}`);
                    item.title = bookName;
                    successCount++;
                } else {
                    console.log('未找到新标题，保持原标题不变');
                    failCount++;
                }
            } catch (error) {
                console.error(`处理URL失败: ${error.message}`);
                failCount++;
            }
            
            // 每处理5个URL后保存一次
            if ((i + 1) % 5 === 0) {
                console.log('\n保存进度...');
                await fs.writeFile(jsonPath, JSON.stringify(wechatData, null, 2), 'utf8');
            }
            
            // 随机延时2-5秒
            const delay = 2000 + Math.floor(Math.random() * 3000);
            await sleep(delay);
        }

        // 最终保存
        await fs.writeFile(jsonPath, JSON.stringify(wechatData, null, 2), 'utf8');
        console.log('\n文件更新完成！');
        console.log(`成功更新: ${successCount} 个标题`);
        console.log(`失败: ${failCount} 个标题`);

    } catch (error) {
        console.error('处理过程中出错:', error);
    }
}

// 运行脚本
updateWechatTitles();