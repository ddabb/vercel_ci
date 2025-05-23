const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

// 获取命令行参数
const index = parseInt(process.argv[2], 10);
if (isNaN(index)) {
    console.error('请提供要处理的URL索引');
    process.exit(1);
}

async function fetchAndExtractBookName(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
            },
            timeout: 15000
        });

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
        } else {
            console.error('Error details:', error.message);
        }
        return null;
    }
}

async function processOneUrl() {
    try {
        // 读取wechat.json文件
        const jsonPath = path.join(__dirname, 'jsons', 'wechat.json');
        const data = await fs.readFile(jsonPath, 'utf8');
        const wechatData = JSON.parse(data);

        if (index < 0 || index >= wechatData.length) {
            console.error(`索引 ${index} 超出范围 (0-${wechatData.length - 1})`);
            process.exit(1);
        }

        const item = wechatData[index];
        console.log(`处理 ${index + 1}/${wechatData.length}: ${item.url}`);
        
        const bookName = await fetchAndExtractBookName(item.url);
        if (bookName) {
            console.log(`原标题: ${item.title}`);
            console.log(`新标题: ${bookName}`);
            item.title = bookName;
            
            // 保存更新后的数据
            await fs.writeFile(jsonPath, JSON.stringify(wechatData, null, 2), 'utf8');
            console.log('文件更新完成！');
        } else {
            console.log('未找到新标题，保持原标题不变');
        }

    } catch (error) {
        console.error('处理过程中出错:', error);
    }
}

// 运行脚本
processOneUrl();